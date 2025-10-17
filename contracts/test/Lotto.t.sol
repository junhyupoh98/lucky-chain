// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {Lotto} from "../src/Lotto.sol";
import {MockVRFCoordinatorV2} from "../src/mocks/MockVRFCoordinatorV2.sol";

contract LottoVRFTest is Test {
    Lotto private lotto;
    MockVRFCoordinatorV2 private mock;

    function setUp() public {
        mock = new MockVRFCoordinatorV2();
        // dummy values
        bytes32 keyHash = bytes32(uint256(1));
        uint64 subId = 1;
        lotto = new Lotto(address(mock), subId, keyHash);

        // 회차 생성 및 현재 회차 설정
        lotto.createOrUpdateDraw(1, block.timestamp + 1 days, true);
        lotto.setCurrentDraw(1);
    }

    function testBuyAndDrawAndDistribute() public {
        // 티켓 가격 지불 (EOA 사용자로 구매)
        uint256 price = lotto.ticketPrice();
        uint8[6] memory numbers = [uint8(1),2,3,4,5,6];
        address user = makeAddr("user");
        vm.deal(user, 10 ether);
        vm.prank(user);
        lotto.buyTicket{value: price}(numbers, "ipfs://cid");

        // 과거 회차에 대해 요청해야 하므로 현재를 2로 바꾸고 1에 대해 요청
        lotto.createOrUpdateDraw(2, block.timestamp + 2 days, true);
        lotto.setCurrentDraw(2);

        uint256 requestId = lotto.requestRandomWinningNumbers(1);

        // VRF fulfill 모의 실행
        mock.fulfillRequest(requestId);

        // winningNumbers 기록되었는지 확인
        (uint8 a0, uint8 a1, uint8 a2, uint8 a3, uint8 a4, uint8 a5) = _getWin(1);
        assertGt(a0, 0);
        assertGt(a1, 0);
        assertGt(a2, 0);
        assertGt(a3, 0);
        assertGt(a4, 0);
        assertGt(a5, 0);
    }

    function testDrawZeroFlow() public {
        uint256 price = lotto.ticketPrice();
        address user = makeAddr("userZero");
        vm.deal(user, 10 ether);

        uint256 fulfillTimestamp = 1_234_567;
        uint256 expectedRequestId = 1;

        uint8[6] memory expectedNumbers = _computeExpectedNumbers(expectedRequestId, fulfillTimestamp);

        // 회차 0 생성 및 판매 오픈 후 구매
        lotto.createOrUpdateDraw(0, block.timestamp, true);
        lotto.setCurrentDraw(0);

        vm.prank(user);
        lotto.buyTicket{value: price}(expectedNumbers, "ipfs://cid-zero");

        // 다음 회차를 현재 회차로 설정하여 0회차 추첨 요청 가능하게 함
        lotto.createOrUpdateDraw(1, block.timestamp + 1 days, true);
        lotto.setCurrentDraw(1);

        uint256 requestId = lotto.requestRandomWinningNumbers(0);
        assertEq(requestId, expectedRequestId);

        uint256 userBalanceBefore = user.balance;
        uint256 poolBefore = lotto.prizePool(0);
        assertEq(poolBefore, price);

        vm.warp(fulfillTimestamp);
        mock.fulfillRequest(requestId);

        // 당첨 번호가 예상 번호와 일치하고 상금이 지급되었는지 확인
        for (uint256 i = 0; i < 6; i++) {
            assertEq(lotto.winningNumbers(0, i), expectedNumbers[i]);
        }

        assertEq(user.balance, userBalanceBefore + price);
        assertEq(lotto.prizePool(0), 0);
    }

    function _getWin(uint256 drawId) internal view returns (uint8, uint8, uint8, uint8, uint8, uint8) {
        return (
            lotto.winningNumbers(drawId, 0),
            lotto.winningNumbers(drawId, 1),
            lotto.winningNumbers(drawId, 2),
            lotto.winningNumbers(drawId, 3),
            lotto.winningNumbers(drawId, 4),
            lotto.winningNumbers(drawId, 5)
        );
    }

    function _computeExpectedNumbers(uint256 requestId, uint256 fulfillTimestamp) internal pure returns (uint8[6] memory numbers) {
        for (uint256 i = 0; i < 6; i++) {
            numbers[i] = uint8((uint256(keccak256(abi.encode(fulfillTimestamp, requestId, i))) % 45) + 1);
        }
    }
}