// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Lotto is ERC721URIStorage, Ownable, VRFConsumerBaseV2 {
        enum Phase {
        Sales,
        Drawing,
        Claimable
    }

    uint256 public constant ROUND_DURATION = 1 weeks;
    uint8 public constant MAIN_NUMBERS = 6;
    uint8 public constant MAX_NUMBER = 45;
    uint256 public ticketPrice;

    uint256 public constant MAX_TICKETS_PER_PURCHASE = 50;

    uint256 public nextTicketId;
    
        uint256 public currentRoundId;
    uint256 public latestRoundId;
    uint256 public carryOverPool;

    uint16 public feeBps;
    uint16 public w1;
    uint16 public w2;
    uint16 public w3;

    address payable public treasury;

    struct Round {
        uint64 startTime;
        uint64 endTime;
        Phase phase;
        uint256 gross; // total ticket sales collected for the round
        uint256 carryIn;
        uint256 carryOut;
        uint256 fee;
        uint256 baseAmt;
        uint256 S1;
        uint256 S2;
        uint256 S3;
        uint256 J;
        uint256 pFirst;
        uint256 pSecond;
        uint256 pThird;
        uint32 firstWinners;
        uint32 secondWinners;
        uint32 thirdWinners;
        uint8[MAIN_NUMBERS] winningNumbers;
        uint8 luckyNumber;
        bool payoutsFinalized;
        uint256 ticketCount;
    }

    struct RoundView {
        uint256 id;
        uint64 startTime;
        uint64 endTime;
        Phase phase;
        uint256 gross;
        uint256 carryIn;
        uint256 carryOut;
        uint256 ticketCount;
        uint8[MAIN_NUMBERS] winningNumbers;
        uint8 luckyNumber;
        uint32 firstWinners;
        uint32 secondWinners;
        uint32 thirdWinners;
        uint256 pFirst;
        uint256 pSecond;
        uint256 pThird;
        bool payoutsFinalized;
    }

    struct TicketView {
        uint256 ticketId;
        uint256 roundId;
        uint64 purchasedAt;
        uint8[MAIN_NUMBERS] numbers;
        uint8 luckyNumber;
        bool isAutoPick;
        uint8 tier;
        bool claimed;
    }

    mapping(uint256 => Round) public rounds;
    mapping(uint256 => uint8[MAIN_NUMBERS]) private _ticketNumbers;
    mapping(uint256 => uint8) public ticketLuckyNumber;
    mapping(uint256 => bool) public ticketAutoPick;
    mapping(uint256 => uint64) public purchaseTimestamps;
    mapping(uint256 => uint256) public ticketToRound;
    mapping(uint256 => uint8) public ticketTier;
    mapping(uint256 => bool) public ticketClaimed;
    mapping(uint256 => uint256[]) private _roundTickets;

    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;

    uint64 private i_subscriptionId;
    bytes32 private i_keyHash;
    uint32 private i_callbackGasLimit = 200000;
    uint16 private i_requestConfirmations = 3;
    uint16 private constant NUM_WORDS = MAIN_NUMBERS + 1;

    mapping(uint256 => uint256) public requestIdToRoundId;

    event TicketPurchased(
        address indexed buyer,
        uint256 indexed ticketId,
        uint256 indexed roundId,
        uint8[MAIN_NUMBERS] numbers,
        uint8 luckyNumber,
        bool isAutoPick
    );
    event RoundStarted(uint256 indexed roundId, uint64 startTime, uint64 endTime, uint256 carryIn);
    event RoundClosed(uint256 indexed roundId);
    event RandomWordsRequested(uint256 indexed requestId, uint256 indexed roundId);
    event WinningNumbersSet(uint256 indexed roundId, uint8[MAIN_NUMBERS] numbers, uint8 luckyNumber);
    event PayoutsFinalized(uint256 indexed roundId, uint256 firstPrize, uint256 secondPrize, uint256 thirdPrize, uint256 carryOut);
    event PrizeClaimed(uint256 indexed ticketId, address indexed claimer, uint256 amount);

    error WrongPhase();
    error InvalidNumbers();
    error TicketNotFound();
    error AlreadyClaimed();
    error NotTicketOwner();
    error PayoutsNotReady();
    error NoPrize();
    error AlreadyFinalized();
    error TooManyTickets();
    error InvalidBatchLength();

    constructor(
        address vrfCoordinator,
        uint64 subscriptionId,
        bytes32 keyHash,
        address payable treasuryAddress,
        uint256 initialTicketPrice,
        uint16 feeBasisPoints,
        uint16 tier1Weight,
        uint16 tier2Weight,
        uint16 tier3Weight
    )
        ERC721("Lucky Chain Lottery", "LCL")
        Ownable(msg.sender)
        VRFConsumerBaseV2(vrfCoordinator) 
    {
        require(treasuryAddress != address(0), "Treasury required");
        require(
            uint256(tier1Weight) + uint256(tier2Weight) + uint256(tier3Weight) <= 10_000,
            "Weights exceed 100%"
        );

        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinator);
        i_subscriptionId = subscriptionId;
        i_keyHash = keyHash;

        treasury = treasuryAddress;
        ticketPrice = initialTicketPrice;
        feeBps = feeBasisPoints;
        w1 = tier1Weight;
        w2 = tier2Weight;
        w3 = tier3Weight;

        latestRoundId = 1;
        currentRoundId = 1;

        Round storage firstRound = rounds[1];
        uint64 start = uint64(block.timestamp);
        firstRound.startTime = start;
        firstRound.endTime = start + uint64(ROUND_DURATION);
        firstRound.phase = Phase.Sales;

        emit RoundStarted(1, firstRound.startTime, firstRound.endTime, 0);
    }

    // --- Round management ---
    function setTicketPrice(uint256 newPrice) external onlyOwner {
        ticketPrice = newPrice;
    }

    function setTreasury(address payable newTreasury) external onlyOwner {
        require(newTreasury != address(0), "invalid treasury");
        treasury = newTreasury;
    }

    function updateFeeConfig(uint16 newFeeBps, uint16 newW1, uint16 newW2, uint16 newW3) external onlyOwner {
        require(uint256(newW1) + uint256(newW2) + uint256(newW3) <= 10_000, "Weights exceed 100%");
        feeBps = newFeeBps;
        w1 = newW1;
        w2 = newW2;
        w3 = newW3;
    }

    function startNextRound(uint64 startTime) external onlyOwner returns (uint256 newRoundId) {
        require(rounds[currentRoundId].phase != Phase.Sales, "Active round still selling");

        if (startTime == 0) {
            startTime = uint64(block.timestamp);
        }
        require(startTime >= block.timestamp, "Start in past");
        require(startTime <= block.timestamp + 30 days, "Start too far");

        newRoundId = latestRoundId + 1;
        latestRoundId = newRoundId;
        currentRoundId = newRoundId;

        Round storage roundData = rounds[newRoundId];
        roundData.startTime = startTime;
        roundData.endTime = startTime + uint64(ROUND_DURATION);
        roundData.phase = Phase.Sales;
        roundData.carryIn = carryOverPool;

        emit RoundStarted(newRoundId, roundData.startTime, roundData.endTime, roundData.carryIn);

        carryOverPool = 0;
    }
    
    function closeCurrentRound() external onlyOwner {
        Round storage roundData = rounds[currentRoundId];
        if (roundData.phase != Phase.Sales) revert WrongPhase();
        require(block.timestamp >= roundData.endTime, "Round still active");

        roundData.phase = Phase.Drawing;
        emit RoundClosed(currentRoundId);
    }

    // --- Ticket purchase ---

    function buyTicket(
        uint8[MAIN_NUMBERS] calldata numbers,
        uint8 luckyNumber,
        bool isAutoPick,
        string calldata tokenURI
    ) external payable {
        Round storage roundData = rounds[currentRoundId];
        if (roundData.phase != Phase.Sales) revert WrongPhase();
        require(block.timestamp >= roundData.startTime && block.timestamp <= roundData.endTime, "Sales window closed");
        uint8[MAIN_NUMBERS][] memory batchNumbers = new uint8[MAIN_NUMBERS][](1);
        batchNumbers[0] = numbers;
        uint8[] memory luckyNumbers = new uint8[](1);
        luckyNumbers[0] = luckyNumber;
        bool[] memory autoPicks = new bool[](1);
        autoPicks[0] = isAutoPick;
        string[] memory tokenURIs = new string[](1);
        tokenURIs[0] = tokenURI;

        _buyTicketsInternal(roundData, batchNumbers, luckyNumbers, autoPicks, tokenURIs, msg.value);
    }

    function buyTickets(
        uint8[MAIN_NUMBERS][] calldata numbersList,
        uint8[] calldata luckyNumbers,
        bool[] calldata autoPicks,
        string[] calldata tokenURIs
    ) external payable {
        Round storage roundData = rounds[currentRoundId];
        if (roundData.phase != Phase.Sales) revert WrongPhase();
        require(block.timestamp >= roundData.startTime && block.timestamp <= roundData.endTime, "Sales window closed");

        uint256 count = numbersList.length;
        if (count == 0) revert InvalidBatchLength();
        if (count > MAX_TICKETS_PER_PURCHASE) revert TooManyTickets();
        if (luckyNumbers.length != count || autoPicks.length != count || tokenURIs.length != count) {
            revert InvalidBatchLength();
        }

        uint8[MAIN_NUMBERS][] memory numbersCopy = new uint8[MAIN_NUMBERS][](count);
        for (uint256 i = 0; i < count; i++) {
            numbersCopy[i] = numbersList[i];
        }

        _buyTicketsInternal(roundData, numbersCopy, luckyNumbers, autoPicks, tokenURIs, msg.value);
    }

    function _buyTicketsInternal(
        Round storage roundData,
        uint8[MAIN_NUMBERS][] memory numbersList,
        uint8[] memory luckyNumbers,
        bool[] memory autoPicks,
        string[] memory tokenURIs,
        uint256 totalPayment
    ) internal {
        uint256 count = numbersList.length;
        uint256 expectedPayment = ticketPrice * count;
        require(totalPayment == expectedPayment, "Incorrect payment");
        uint256 startingId = nextTicketId;
        uint256 currentRound = currentRoundId;

        for (uint256 i = 0; i < count; i++) {
            uint8[MAIN_NUMBERS] memory numbers = numbersList[i];
            uint8 luckyNumber = luckyNumbers[i];
            bool isAutoPick = autoPicks[i];

            _validateNumbers(numbers, luckyNumber);

            uint256 tokenId = startingId + i;
            _ticketNumbers[tokenId] = numbers;
            ticketLuckyNumber[tokenId] = luckyNumber;
            ticketAutoPick[tokenId] = isAutoPick;
            purchaseTimestamps[tokenId] = uint64(block.timestamp);
            ticketToRound[tokenId] = currentRound;

            _roundTickets[currentRound].push(tokenId);

            _safeMint(msg.sender, tokenId);
            _setTokenURI(tokenId, tokenURIs[i]);

            emit TicketPurchased(msg.sender, tokenId, currentRound, numbers, luckyNumber, isAutoPick);
        }

        nextTicketId = startingId + count;
        roundData.ticketCount += count;
        roundData.gross += totalPayment;
    }

    function _validateNumbers(uint8[MAIN_NUMBERS] memory numbers, uint8 luckyNumber) internal pure {
        if (luckyNumber == 0 || luckyNumber > MAX_NUMBER) revert InvalidNumbers();

        bool[MAX_NUMBER + 1] memory seen;
        for (uint256 i = 0; i < MAIN_NUMBERS; i++) {
            uint8 value = numbers[i];
            if (value == 0 || value > MAX_NUMBER || seen[value]) {
                revert InvalidNumbers();
            }
            seen[value] = true;
        }

        if (seen[luckyNumber]) revert InvalidNumbers();
    }

    // --- Chainlink VRF ---

    function requestRandomWinningNumbers(uint256 roundId) external onlyOwner returns (uint256 requestId) {
        Round storage roundData = rounds[roundId];
        if (roundData.phase != Phase.Drawing) revert WrongPhase();
        require(roundData.winningNumbers[0] == 0 && roundData.luckyNumber == 0, "Already drawn");

        requestId = i_vrfCoordinator.requestRandomWords(
            i_keyHash,
            i_subscriptionId,
            i_requestConfirmations,
            i_callbackGasLimit,
            NUM_WORDS
        );
        
        requestIdToRoundId[requestId] = roundId;
        emit RandomWordsRequested(requestId, roundId);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        uint256 roundId = requestIdToRoundId[requestId];
        require(roundId != 0, "Unknown request");
        delete requestIdToRoundId[requestId];

        Round storage roundData = rounds[roundId];
        if (roundData.phase != Phase.Drawing) revert WrongPhase();

        (uint8[MAIN_NUMBERS] memory winning, uint8 lucky) = _generateWinningNumbers(randomWords);
        roundData.winningNumbers = winning;
        roundData.luckyNumber = lucky;
        roundData.phase = Phase.Claimable;

        _evaluateTickets(roundId, winning, lucky);

        emit WinningNumbersSet(roundId, winning, lucky);
    }

    function _generateWinningNumbers(uint256[] memory randomWords)
        internal
        pure
        returns (uint8[MAIN_NUMBERS] memory mainNumbers, uint8 luckyNumber)
    {
        require(randomWords.length >= NUM_WORDS, "Insufficient random words");
        bool[MAX_NUMBER + 1] memory used;

        for (uint256 i = 0; i < MAIN_NUMBERS; i++) {
            uint256 word = randomWords[i];
            uint8 candidate = uint8((word % MAX_NUMBER) + 1);
            while (used[candidate]) {
                word = uint256(keccak256(abi.encode(word, i)));
                candidate = uint8((word % MAX_NUMBER) + 1);
            }
            mainNumbers[i] = candidate;
            used[candidate] = true;
        }
        uint256 luckyWord = randomWords[MAIN_NUMBERS];
        uint8 luckyCandidate = uint8((luckyWord % MAX_NUMBER) + 1);
        while (used[luckyCandidate]) {
            luckyWord = uint256(keccak256(abi.encode(luckyWord, uint256(0xAAA))));
            luckyCandidate = uint8((luckyWord % MAX_NUMBER) + 1);
        }
        luckyNumber = luckyCandidate;
        _sort(mainNumbers);
    }

    function _sort(uint8[MAIN_NUMBERS] memory data) internal pure {
        for (uint256 i = 1; i < MAIN_NUMBERS; i++) {
            uint8 key = data[i];
            uint256 j = i;
            while (j > 0 && data[j - 1] > key) {
                data[j] = data[j - 1];
                j--;
            }
            data[j] = key;
        }
    }

    function _evaluateTickets(
        uint256 roundId,
        uint8[MAIN_NUMBERS] memory winning,
        uint8 lucky
    ) internal {
        uint256[] memory tickets = _roundTickets[roundId];
        uint32 first;
        uint32 second;
        uint32 third;

        for (uint256 i = 0; i < tickets.length; i++) {
            uint256 ticketId = tickets[i];
            uint8[MAIN_NUMBERS] memory picked = _ticketNumbers[ticketId];
            (uint8 matched, bool luckyMatch) = _countMatches(picked, winning, lucky);

            uint8 tier;
            if (matched == MAIN_NUMBERS) {
                tier = 1;
                first += 1;
            } else if (matched == MAIN_NUMBERS - 1 && luckyMatch) {
                tier = 2;
                second += 1;
            } else if (matched == MAIN_NUMBERS - 1) {
                tier = 3;
                third += 1;
            }

            if (tier > 0) {
                ticketTier[ticketId] = tier;
            }
        }

        Round storage roundData = rounds[roundId];
        roundData.firstWinners = first;
        roundData.secondWinners = second;
        roundData.thirdWinners = third;
    }

    function _countMatches(
        uint8[MAIN_NUMBERS] memory player,
        uint8[MAIN_NUMBERS] memory winning,
        uint8 lucky
    ) internal pure returns (uint8 matches, bool luckyMatch) {
        bool[MAX_NUMBER + 1] memory present;
        for (uint256 i = 0; i < MAIN_NUMBERS; i++) {
            present[winning[i]] = true;
        }

        for (uint256 j = 0; j < MAIN_NUMBERS; j++) {
            if (present[player[j]]) {
                matches += 1;
            }
        }

        for (uint256 k = 0; k < MAIN_NUMBERS; k++) {
            if (player[k] == lucky) {
                luckyMatch = true;
                break;
            }
        }
    }

    // --- Prize settlement ---

    function finalizePayouts(uint256 roundId) external onlyOwner {
        Round storage r = rounds[roundId];
        if (r.phase != Phase.Claimable) revert WrongPhase();
        if (r.payoutsFinalized) revert AlreadyFinalized();

        r.fee = (r.gross * feeBps) / 10_000;
        r.baseAmt = r.gross - r.fee;

        r.S1 = (r.baseAmt * w1) / 10_000;
        r.S2 = (r.baseAmt * w2) / 10_000;
        r.S3 = (r.baseAmt * w3) / 10_000;
        r.J = r.S1 + r.carryIn;

        bool has1 = r.firstWinners > 0;
        bool has2 = r.secondWinners > 0;
        bool has3 = r.thirdWinners > 0;

        uint256 p1;
        uint256 p2;
        uint256 p3;

        uint256 prizeBudget = r.baseAmt + r.carryIn;
        if (!has1) {
            r.pFirst = 0;
            r.pSecond = 0;
            r.pThird = 0;
            r.carryOut = prizeBudget;
        } else {
            if (!has2 && !has3) {
                p1 = (r.J + r.S2 + r.S3) / r.firstWinners;
            } else if (!has2 && has3) {
                p1 = r.J / r.firstWinners;
                p3 = (r.S3 + r.S2) / r.thirdWinners;
            } else {
                p1 = r.J / r.firstWinners;
                if (has2) {
                    p2 = r.S2 / r.secondWinners;
                }
                if (has3) {
                    p3 = r.S3 / r.thirdWinners;
                }
            }
            
            uint256 paidTotal = (p1 * r.firstWinners) + (p2 * r.secondWinners) + (p3 * r.thirdWinners);
            r.carryOut = prizeBudget - paidTotal;

            r.pFirst = p1;
            r.pSecond = p2;
            r.pThird = p3;
        }

        if (r.fee > 0 && treasury != address(0)) {
            (bool ok, ) = treasury.call{value: r.fee}("");
            require(ok, "fee xfer");
        }

        r.payoutsFinalized = true;
        carryOverPool += r.carryOut;

        emit PayoutsFinalized(roundId, r.pFirst, r.pSecond, r.pThird, r.carryOut);
    }

    function claimPrize(uint256 ticketId) external {
        if (!_ticketExists(ticketId)) revert TicketNotFound();
        if (ownerOf(ticketId) != msg.sender) revert NotTicketOwner();
        if (ticketClaimed[ticketId]) revert AlreadyClaimed();

        uint256 roundId = ticketToRound[ticketId];
        Round storage roundData = rounds[roundId];
        if (!roundData.payoutsFinalized) revert PayoutsNotReady();

        uint8 tier = ticketTier[ticketId];
        uint256 amount;
        if (tier == 1) {
            amount = roundData.pFirst;
        } else if (tier == 2) {
            amount = roundData.pSecond;
        } else if (tier == 3) {
            amount = roundData.pThird;
        }
        if (amount == 0) revert NoPrize();

        ticketClaimed[ticketId] = true;

        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        require(ok, "Transfer failed");

        emit PrizeClaimed(ticketId, msg.sender, amount);
    }

    // --- Views ---

    function getRoundInfo(uint256 roundId) external view returns (RoundView memory info) {
        Round storage r = rounds[roundId];
        info = RoundView({
            id: roundId,
            startTime: r.startTime,
            endTime: r.endTime,
            phase: r.phase,
            gross: r.gross,
            carryIn: r.carryIn,
            carryOut: r.carryOut,
            ticketCount: r.ticketCount,
            winningNumbers: r.winningNumbers,
            luckyNumber: r.luckyNumber,
            firstWinners: r.firstWinners,
            secondWinners: r.secondWinners,
            thirdWinners: r.thirdWinners,
            pFirst: r.pFirst,
            pSecond: r.pSecond,
            pThird: r.pThird,
            payoutsFinalized: r.payoutsFinalized
        });
    }

    function getTicketInfo(uint256 ticketId) external view returns (TicketView memory viewData) {
        if (!_ticketExists(ticketId)) revert TicketNotFound();
        viewData = TicketView({
            ticketId: ticketId,
            roundId: ticketToRound[ticketId],
            purchasedAt: purchaseTimestamps[ticketId],
            numbers: _ticketNumbers[ticketId],
            luckyNumber: ticketLuckyNumber[ticketId],
            isAutoPick: ticketAutoPick[ticketId],
            tier: ticketTier[ticketId],
            claimed: ticketClaimed[ticketId]
        });
    }

    function getRoundTickets(uint256 roundId) external view returns (uint256[] memory) {
        return _roundTickets[roundId];
    }
    
    function ticketNumbers(uint256 ticketId) external view returns (uint8[MAIN_NUMBERS] memory) {
        if (!_ticketExists(ticketId)) revert TicketNotFound();
        return _ticketNumbers[ticketId];
    }

    function withdrawUnclaimed(address payable recipient, uint256 amount) external onlyOwner {
        require(recipient != address(0), "invalid recipient");
        require(amount <= address(this).balance, "insufficient balance");
        (bool ok, ) = recipient.call{value: amount}("");
        require(ok, "withdraw failed");
    }

    function _ticketExists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
