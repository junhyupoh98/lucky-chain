// Deploy.s.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/KiwoomFarm1155.sol";

// 배포 스크립트는 Script 컨트랙트를 상속받습니다.
contract DeployKiwoomFarm is Script {
    function run() external returns (KiwoomFarm1155) {
        // `vm.startBroadcast()`와 `vm.stopBroadcast()` 사이의 모든 트랜잭션은
        // 실제 블록체인에 전송됩니다.
        vm.startBroadcast();

        // KiwoomFarm1155 컨트랙트를 새로 배포합니다.
        KiwoomFarm1155 kiwoomFarm = new KiwoomFarm1155();

        vm.stopBroadcast();
        
        // 배포된 컨트랙트 인스턴스를 반환합니다.
        return kiwoomFarm;
    }
}
