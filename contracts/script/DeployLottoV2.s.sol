// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {LottoV2} from "../src/LottoV2.sol";

contract DeployLottoV2 is Script {
    function run() external {
        address vrfCoordinator = vm.envAddress("VRF_COORDINATOR_V2");
        uint64 subscriptionId = uint64(vm.envUint("VRF_SUBSCRIPTION_ID"));
        bytes32 keyHash = vm.envBytes32("VRF_KEY_HASH");
        address payable treasury = payable(vm.envAddress("TREASURY_ADDRESS"));
        address usdt = vm.envAddress("USDT_ADDRESS");
        address usdc = vm.envAddress("USDC_ADDRESS");
        
        uint16 feeBps = uint16(vm.envOr("FEE_BPS", uint256(500)));
        uint16 w1 = uint16(vm.envOr("W1", uint256(6000)));
        uint16 w2 = uint16(vm.envOr("W2", uint256(2500)));
        uint16 w3 = uint16(vm.envOr("W3", uint256(1500)));

        vm.startBroadcast();

        LottoV2 lotto = new LottoV2(
            vrfCoordinator,
            subscriptionId,
            keyHash,
            treasury,
            usdt,
            usdc,
            feeBps,
            w1,
            w2,
            w3
        );

        console.log("LottoV2 deployed at:", address(lotto));
        console.log("USDT:", usdt);
        console.log("USDC:", usdc);
        console.log("Treasury:", treasury);

        vm.stopBroadcast();
    }
}
