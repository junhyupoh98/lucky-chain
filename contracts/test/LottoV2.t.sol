// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {LottoV2} from "../src/LottoV2.sol";
import {MockVRFCoordinatorV2} from "../src/mocks/MockVRFCoordinatorV2.sol";
import {MockERC20} from "../src/mocks/MockERC20.sol";

contract LottoV2Test is Test {
    LottoV2 private lotto;
    MockVRFCoordinatorV2 private mock;
    MockERC20 private usdt;
    MockERC20 private usdc;

    address payable private treasury = payable(makeAddr("treasury"));
    address private user = makeAddr("user");

    uint256 private constant TICKET_PRICE = 1e6;
    uint16 private constant FEE_BPS = 500;
    uint16 private constant W1 = 6000;
    uint16 private constant W2 = 2500;
    uint16 private constant W3 = 1500;

    function setUp() public {
        mock = new MockVRFCoordinatorV2();
        usdt = new MockERC20("Tether USD", "USDT", 6);
        usdc = new MockERC20("USD Coin", "USDC", 6);
        
        bytes32 keyHash = bytes32(uint256(1));
        uint64 subId = 1;
        lotto = new LottoV2(
            address(mock),
            subId,
            keyHash,
            treasury,
            address(usdt),
            address(usdc),
            FEE_BPS,
            W1,
            W2,
            W3
        );

        usdt.mint(user, 100e6);
        usdc.mint(user, 100e6);
    }

    function testBuyTicketWithUSDT() public {
        vm.startPrank(user);
        usdt.approve(address(lotto), TICKET_PRICE);
        lotto.buyTicket(true, "ipfs://ticket");
        vm.stopPrank();

        assertEq(lotto.nextTicketId(), 1);
        assertGt(lotto.ticketLuckyNumber(0), 0);
        assertTrue(lotto.ticketIsUSDT(0));
        assertEq(lotto.ticketToRound(0), 1);
        assertEq(lotto.ticketTier(0), 0);
        assertGt(lotto.purchaseTimestamps(0), 0);

        LottoV2.RoundView memory roundInfo = lotto.getRoundInfo(1);
        assertEq(roundInfo.ticketCount, 1);
        assertEq(roundInfo.grossUSDT, TICKET_PRICE);
        assertEq(roundInfo.grossUSDC, 0);
        assertEq(uint256(roundInfo.phase), uint256(LottoV2.Phase.Sales));
    }

    function testBuyTicketWithUSDC() public {
        vm.startPrank(user);
        usdc.approve(address(lotto), TICKET_PRICE);
        lotto.buyTicket(false, "ipfs://ticket");
        vm.stopPrank();

        assertEq(lotto.nextTicketId(), 1);
        assertGt(lotto.ticketLuckyNumber(0), 0);
        assertFalse(lotto.ticketIsUSDT(0));
        assertEq(lotto.ticketToRound(0), 1);

        LottoV2.RoundView memory roundInfo = lotto.getRoundInfo(1);
        assertEq(roundInfo.ticketCount, 1);
        assertEq(roundInfo.grossUSDT, 0);
        assertEq(roundInfo.grossUSDC, TICKET_PRICE);
    }

    function testBuyMultipleTickets() public {
        string[] memory uris = new string[](3);
        uris[0] = "ipfs://ticket-1";
        uris[1] = "ipfs://ticket-2";
        uris[2] = "ipfs://ticket-3";

        vm.startPrank(user);
        usdt.approve(address(lotto), TICKET_PRICE * 3);
        lotto.buyTickets(true, 3, uris);
        vm.stopPrank();

        assertEq(lotto.nextTicketId(), 3);
        assertEq(lotto.ticketToRound(0), 1);
        assertEq(lotto.ticketToRound(1), 1);
        assertEq(lotto.ticketToRound(2), 1);

        LottoV2.RoundView memory info = lotto.getRoundInfo(1);
        assertEq(info.ticketCount, 3);
        assertEq(info.grossUSDT, TICKET_PRICE * 3);
    }

    function testAutoProgressRound() public {
        vm.warp(block.timestamp + 8 days);
        
        lotto.autoProgressRound();
        
        LottoV2.RoundView memory info = lotto.getRoundInfo(1);
        assertEq(uint256(info.phase), uint256(LottoV2.Phase.Drawing));
    }

    function testFullFlowWithUSDT() public {
        vm.startPrank(user);
        usdt.approve(address(lotto), TICKET_PRICE);
        lotto.buyTicket(true, "ipfs://ticket");
        vm.stopPrank();

        vm.warp(block.timestamp + 8 days);
        lotto.closeCurrentRound();

        uint256 requestId = lotto.requestRandomWinningNumbers(1);

        uint256[] memory randomWords = new uint256[](7);
        for (uint256 i = 0; i < randomWords.length; i++) {
            randomWords[i] = i;
        }

        vm.prank(address(mock));
        lotto.rawFulfillRandomWords(requestId, randomWords);

        LottoV2.RoundView memory info = lotto.getRoundInfo(1);
        assertEq(uint256(info.phase), uint256(LottoV2.Phase.Claimable));

        uint256 treasuryBefore = usdt.balanceOf(treasury);
        lotto.finalizePayouts(1);

        uint256 expectedFee = (TICKET_PRICE * FEE_BPS) / 10_000;
        assertEq(usdt.balanceOf(treasury) - treasuryBefore, expectedFee);

        info = lotto.getRoundInfo(1);
        assertTrue(info.payoutsFinalized);

        if (info.pFirstUSDT > 0) {
            uint256 userBalanceBefore = usdt.balanceOf(user);
            vm.prank(user);
            lotto.claimPrize(0);

            assertEq(usdt.balanceOf(user), userBalanceBefore + info.pFirstUSDT);
            assertTrue(lotto.ticketClaimed(0));
        }
    }

    function testMixedPaymentTokens() public {
        vm.startPrank(user);
        usdt.approve(address(lotto), TICKET_PRICE);
        lotto.buyTicket(true, "ipfs://ticket-usdt");
        
        usdc.approve(address(lotto), TICKET_PRICE);
        lotto.buyTicket(false, "ipfs://ticket-usdc");
        vm.stopPrank();

        LottoV2.RoundView memory info = lotto.getRoundInfo(1);
        assertEq(info.ticketCount, 2);
        assertEq(info.grossUSDT, TICKET_PRICE);
        assertEq(info.grossUSDC, TICKET_PRICE);
    }

    function testNumbersAreUnique() public {
        vm.startPrank(user);
        usdt.approve(address(lotto), TICKET_PRICE);
        lotto.buyTicket(true, "ipfs://ticket");
        vm.stopPrank();

        uint8[6] memory numbers = lotto.ticketNumbers(0);
        uint8 luckyNumber = lotto.ticketLuckyNumber(0);

        bool[46] memory seen;
        for (uint256 i = 0; i < 6; i++) {
            assertGt(numbers[i], 0);
            assertLe(numbers[i], 45);
            assertFalse(seen[numbers[i]]);
            seen[numbers[i]] = true;
        }

        assertGt(luckyNumber, 0);
        assertLe(luckyNumber, 45);
        assertFalse(seen[luckyNumber]);
    }
}
