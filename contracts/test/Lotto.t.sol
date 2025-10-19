// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {Lotto} from "../src/Lotto.sol";
import {MockVRFCoordinatorV2} from "../src/mocks/MockVRFCoordinatorV2.sol";

contract LottoVRFTest is Test {
    Lotto private lotto;
    MockVRFCoordinatorV2 private mock;

    address payable private treasury = payable(makeAddr("treasury"));
    address private user = makeAddr("user");

    uint256 private constant TICKET_PRICE = 1 ether;
    uint16 private constant FEE_BPS = 500; // 5%
    uint16 private constant W1 = 6000;
    uint16 private constant W2 = 2500;
    uint16 private constant W3 = 1500;

    function setUp() public {
        mock = new MockVRFCoordinatorV2();
        bytes32 keyHash = bytes32(uint256(1));
        uint64 subId = 1;
        lotto = new Lotto(
            address(mock),
            subId,
            keyHash,
            treasury,
            TICKET_PRICE,
            FEE_BPS,
            W1,
            W2,
            W3
        );
    }

    function testBuyTicketStoresNumbers() public {
        vm.deal(user, 2 ether);
        uint8[6] memory numbers = [uint8(1), 2, 3, 4, 5, 6];

        vm.prank(user);
        lotto.buyTicket{value: TICKET_PRICE}(numbers, 7, false, "ipfs://ticket");

        assertEq(lotto.nextTicketId(), 1);
        assertEq(lotto.ticketLuckyNumber(0), 7);
        assertFalse(lotto.ticketAutoPick(0));
        assertEq(lotto.ticketToRound(0), 1);
        assertEq(lotto.ticketTier(0), 0);
        assertGt(lotto.purchaseTimestamps(0), 0);

        Lotto.RoundView memory roundInfo = lotto.getRoundInfo(1);
        assertEq(roundInfo.ticketCount, 1);
        assertEq(roundInfo.gross, TICKET_PRICE);
        assertEq(uint256(roundInfo.phase), uint256(Lotto.Phase.Sales));
    }

    function testFinalizeAndClaimPrizeFlow() public {
        vm.deal(user, 2 ether);
        uint8[6] memory numbers = [uint8(1), 2, 3, 4, 5, 6];

        vm.prank(user);
        lotto.buyTicket{value: TICKET_PRICE}(numbers, 7, false, "ipfs://ticket");

        // Move beyond sales window and close the round.
        vm.warp(block.timestamp + 8 days);
        lotto.closeCurrentRound();

        uint256 requestId = lotto.requestRandomWinningNumbers(1);

        // Provide deterministic random words so the winning numbers match the ticket.
        uint256[] memory randomWords = new uint256[](7);
        for (uint256 i = 0; i < randomWords.length; i++) {
            randomWords[i] = i;
        }

        vm.prank(address(mock));
        lotto.rawFulfillRandomWords(requestId, randomWords);

        Lotto.RoundView memory info = lotto.getRoundInfo(1);
        assertEq(uint256(info.phase), uint256(Lotto.Phase.Claimable));
        assertEq(info.firstWinners, 1);
        assertEq(info.secondWinners, 0);
        assertEq(info.thirdWinners, 0);

        uint256 treasuryBefore = treasury.balance;
        lotto.finalizePayouts(1);

        uint256 expectedFee = (TICKET_PRICE * FEE_BPS) / 10_000;
        assertEq(treasury.balance - treasuryBefore, expectedFee);

        info = lotto.getRoundInfo(1);
        assertTrue(info.payoutsFinalized);
        assertEq(info.pFirst, TICKET_PRICE - expectedFee);
        assertEq(info.pSecond, 0);
        assertEq(info.pThird, 0);
        assertEq(info.carryOut, 0);
        assertEq(lotto.carryOverPool(), 0);

        uint256 userBalanceBefore = user.balance;
        vm.prank(user);
        lotto.claimPrize(0);

        assertEq(user.balance, userBalanceBefore + info.pFirst);
        assertTrue(lotto.ticketClaimed(0));
    }
}