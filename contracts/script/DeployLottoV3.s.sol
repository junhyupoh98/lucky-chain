// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {LottoV3} from "../src/LottoV3.sol";

contract DeployLottoV3 is Script {
    function run() external returns (LottoV3) {
        address vrfCoordinator = vm.envAddress("VRF_COORDINATOR");
        uint64 subscriptionId = uint64(vm.envUint("VRF_SUBSCRIPTION_ID"));
        bytes32 keyHash = vm.envBytes32("VRF_KEY_HASH");
        address payable teamTreasury = payable(vm.envAddress("TEAM_TREASURY"));
        address payable gasTreasury = payable(vm.envAddress("GAS_TREASURY"));
        address usdtAddress = vm.envAddress("USDT_ADDRESS");
        address usdcAddress = vm.envAddress("USDC_ADDRESS");

        vm.startBroadcast();

        LottoV3 lotto = new LottoV3(
            vrfCoordinator,
            subscriptionId,
            keyHash,
            teamTreasury,
            gasTreasury,
            usdtAddress,
            usdcAddress
        );

        vm.stopBroadcast();

        return lotto;
    }
}
