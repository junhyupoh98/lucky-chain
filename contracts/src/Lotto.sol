// contracts/src/Lotto.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// 🚨 [Chainlink VRF Import] VRF 기능을 위한 인터페이스와 컨슈머를 가져옵니다.
import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

// 🚨 [Inheritance 변경] ERC721URIStorage, Ownable 외에 VRFConsumerBaseV2를 상속받습니다.
contract Lotto is ERC721URIStorage, Ownable, VRFConsumerBaseV2 {
    
    // --- 💰 [기존 변수] ---
    uint256 public ticketPrice = 0.01 ether;
    uint256 public nextTicketId;
    uint256 public currentDrawId;

    // --- 💾 [데이터 구조] ---
    struct Draw {
        uint256 drawTimestamp;
        bool isOpenForSale;
    }

    mapping(uint256 => Draw) public draws;
    mapping(uint256 => uint8[6]) public ticketNumbers;
    mapping(uint256 => uint256) public purchaseTimestamps;
    mapping(uint256 => uint256) public ticketToDraw;
    // 회차별 발행된 티켓 ID 목록 (정산용)
    mapping(uint256 => uint256[]) private _drawIdToTicketIds;
    
    // --- 🎲 [VRF 및 로또 결과 관련 변수 추가] 🎲 ---
    mapping(uint256 => uint8[6]) public winningNumbers; // 회차별 당첨 번호 저장
    mapping(uint256 => uint256) public prizePool;      // 회차별 총 상금 풀 (KAI)

    // VRF Coordinator 컨트랙트 주소
    VRFCoordinatorV2Interface immutable i_vrfCoordinator;
    
    // VRF 설정 값
    uint64 i_subscriptionId; 
    bytes32 i_keyHash;
    uint32 i_callbackGasLimit = 100000;
    uint16 i_requestConfirmations = 3; // VRF 요청 확인 블록 수
    uint16 constant NUM_WORDS = 6; // 요청할 난수의 개수
    
    // 난수 요청 ID와 회차 ID를 연결합니다. (0 = 미설정이므로 drawId+1 저장)
    mapping(uint256 => uint256) public requestIdToDrawId;
    
    // --- 📢 [이벤트 추가] 📢 ---
    event TicketPurchased(address indexed buyer, uint256 indexed ticketId, uint256 indexed drawId, uint8[6] numbers);
    event DrawCreated(uint256 indexed drawId, uint256 drawTimestamp);
    event RandomWordsRequested(uint256 indexed requestId, uint256 indexed drawId);
    event WinningNumbersSet(uint256 indexed drawId, uint8[6] numbers);
    event PrizesDistributed(uint256 indexed drawId, uint256 totalWinners, uint256 prizePerWinner);


    // --- 🛠️ [Constructor 수정: VRF 인자 추가] 🛠️ ---
    constructor(
        address vrfCoordinatorV2, 
        uint64 subscriptionId,
        bytes32 keyHash
    )
        ERC721("Kiwoom Lottery Ticket", "KLT")
        Ownable(msg.sender)
        // VRFConsumerBaseV2의 생성자를 호출합니다.
        VRFConsumerBaseV2(vrfCoordinatorV2) 
    {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_subscriptionId = subscriptionId;
        i_keyHash = keyHash;
    }


    // --- 💸 [기존 buyTicket 함수] ---
    function buyTicket(uint8[6] memory _numbers, string memory _tokenURI) external payable {
        require(draws[currentDrawId].isOpenForSale, "Current draw is not open for sale");
        require(msg.value >= ticketPrice, "Lotto: Not enough funds");
        _validateNumbers(_numbers);
        
        uint256 tokenId = nextTicketId;
        
        ticketNumbers[tokenId] = _numbers;
        purchaseTimestamps[tokenId] = block.timestamp;
        ticketToDraw[tokenId] = currentDrawId;
        _drawIdToTicketIds[currentDrawId].push(tokenId);
        
        // 🚨 [상금 풀 업데이트 추가] 🚨: 구매 금액을 현재 회차 상금 풀에 더합니다.
        prizePool[currentDrawId] += msg.value;
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        
        nextTicketId++;
        emit TicketPurchased(msg.sender, tokenId, currentDrawId, _numbers);
    }

    // --- 🔎 [입력 번호 유효성 검증] ---
    function _validateNumbers(uint8[6] memory numbers) internal pure {
        // 각 번호는 1~45 사이, 중복 금지
        bool[46] memory seen;
        for (uint256 i = 0; i < 6; i++) {
            uint8 n = numbers[i];
            require(n >= 1 && n <= 45, "Lotto: numbers must be 1..45");
            require(!seen[n], "Lotto: duplicate numbers");
            seen[n] = true;
        }
    }
    
    // --- (createOrUpdateDraw, setCurrentDraw 함수는 그대로 둡니다) ---
    function createOrUpdateDraw(uint256 _drawId, uint256 _drawTimestamp, bool _isOpenForSale) external onlyOwner {
        draws[_drawId] = Draw({
            drawTimestamp: _drawTimestamp,
            isOpenForSale: _isOpenForSale
        });
        emit DrawCreated(_drawId, _drawTimestamp);
    }

    function setCurrentDraw(uint256 _drawId) external onlyOwner {
        currentDrawId = _drawId;
    }

    // --- 🎲 [난수 요청 함수 추가] 🎲 ---
    /**
     * @notice 난수 생성을 요청하고, 요청 ID를 기록합니다. (추첨 시작)
     * @dev Keepers 또는 Owner에 의해 호출되어야 합니다.
     */
    function requestRandomWinningNumbers(uint256 _drawId) public onlyOwner returns (uint256 requestId) {
        
        // 1. 보안/유효성 검사: 추첨이 진행 중이거나 판매 중인 회차는 안 됩니다.
        require(_drawId < currentDrawId, "Lotto: Cannot draw current or future draw.");
        require(winningNumbers[_drawId][0] == 0, "Lotto: Winning numbers already set.");
        
        // 2. Chainlink VRF Coordinator에 난수 생성을 요청합니다.
        requestId = i_vrfCoordinator.requestRandomWords(
            i_keyHash,
            i_subscriptionId,
            i_requestConfirmations,
            i_callbackGasLimit,
            NUM_WORDS
        );
        
        // 3. 요청 ID와 회차 ID를 연결
        requestIdToDrawId[requestId] = _drawId + 1;

        emit RandomWordsRequested(requestId, _drawId);
    }
    
    // --- 🎲 [난수 수신 및 처리 함수] 🎲 ---
    /**
     * @notice Chainlink VRF 시스템으로부터 난수 결과(randomWords)를 수신하는 함수입니다.
     * @dev 이 함수는 Chainlink VRF Coordinator에 의해서만 호출됩니다.
     */
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) 
        internal 
        override 
    {
        uint256 drawId = requestIdToDrawId[requestId];
        require(drawId != 0, "Lotto: Request ID not found.");
        uint256 drawId = stored - 1;
        
        uint8[6] memory finalNumbers;
        
        // 🚨 [주의] 현재 로직은 단순 변환(1~45, 중복 허용)입니다.
        // 다음 단계에서 '중복 없는 난수' 로직으로 수정해야 합니다.
        for (uint i = 0; i < NUM_WORDS; i++) {
            finalNumbers[i] = uint8((randomWords[i] % 45) + 1);
        }

        winningNumbers[drawId] = finalNumbers;
        
        delete requestIdToDrawId[requestId];

        emit WinningNumbersSet(drawId, finalNumbers);
        
        // 당첨금 분배
        _distributePrizes(drawId);
    }

    // --- 🧮 [유틸: 번호 일치 개수 계산] ---
    function _countMatches(uint8[6] memory a, uint8[6] memory b) internal pure returns (uint8) {
        bool[46] memory present;
        for (uint256 i = 0; i < 6; i++) {
            present[a[i]] = true;
        }
        uint8 matches;
        for (uint256 j = 0; j < 6; j++) {
            if (present[b[j]]) matches++;
        }
        return matches;
    }

    // --- 💰 [당첨금 분배] ---
    function _distributePrizes(uint256 drawId) internal {
        uint8[6] memory win = winningNumbers[drawId];
        require(win[0] != 0, "Lotto: winning numbers not set");

        uint256[] memory tickets = _drawIdToTicketIds[drawId];
        uint256 totalTickets = tickets.length;
        if (totalTickets == 0) {
            return; // 분배할 대상 없음
        }

        // 6개 일치한 잭팟 수상자 계산
        uint256 winnersCount;
        for (uint256 i = 0; i < totalTickets; i++) {
            uint256 tokenId = tickets[i];
            uint8[6] memory picked = ticketNumbers[tokenId];
            if (_countMatches(picked, win) == 6) {
                winnersCount++;
            }
        }

        uint256 pool = prizePool[drawId];
        if (winnersCount == 0 || pool == 0) {
            return; // 수상자 없거나 풀 0
        }

        uint256 share = pool / winnersCount;
        // 상태를 먼저 업데이트하여 재진입 여지 축소
        prizePool[drawId] = 0;

        for (uint256 i = 0; i < totalTickets; i++) {
            uint256 tokenId = tickets[i];
            uint8[6] memory picked = ticketNumbers[tokenId];
            if (_countMatches(picked, win) == 6) {
                address winner = ownerOf(tokenId);
                (bool ok, ) = payable(winner).call{value: share}("");
                require(ok, "Lotto: payout failed");
            }
        }

        emit PrizesDistributed(drawId, winnersCount, share);
    }
    
    // --- 💰 [기존 withdraw 함수] ---
    function withdraw() external onlyOwner {
        // 주의: 이 함수는 상금 분배 로직과는 별개로, 남은 컨트랙트 잔액을 오너에게 보내는 용도입니다.
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }

    // --- (ERC721 내부 함수) ---
    function _baseURI() internal pure override returns (string memory) { return ""; }
}