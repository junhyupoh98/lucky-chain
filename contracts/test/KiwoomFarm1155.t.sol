//KiwoomFarm1155.t.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/KiwoomFarm1155.sol";

contract KiwoomFarm1155Test is Test {
    KiwoomFarm1155 public kiwoomFarm;
    address public owner;
    address public user1;

    function setUp() public {
        kiwoomFarm = new KiwoomFarm1155();
        // --- 여기가 수정된 부분 ---
        // owner를 실제 사용자 지갑 주소(EOA)처럼 만듭니다.
        owner = makeAddr("owner");
        user1 = makeAddr("user1");

        // KiwoomFarm 컨트랙트의 소유권을 'owner' 주소로 이전합니다.
        // 이렇게 해야 owner가 onlyOwner 함수를 호출할 수 있습니다.
        kiwoomFarm.transferOwnership(owner);
    }

    function testCreateNewToken() public {
        // --- 여기가 수정된 부분 ---
        // vm.prank: 다음 한 번의 함수 호출을 'owner'가 하는 것처럼 시뮬레이션합니다.
        vm.prank(owner);
        // 이제 owner는 EOA이므로, 토큰을 문제 없이 받을 수 있습니다.
        kiwoomFarm.createNewToken(100, "uri_for_token_1");

        // 검증(Assert)
        assertEq(kiwoomFarm.nextTokenId(), 1, "Next Token ID should be 1");
        assertEq(kiwoomFarm.uri(1), "uri_for_token_1", "URI should be set correctly");
        assertEq(kiwoomFarm.balanceOf(owner, 1), 100, "Owner should have 100 tokens of ID 1");
    }
}
