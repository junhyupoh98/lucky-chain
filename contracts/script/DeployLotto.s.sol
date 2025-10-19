// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {Lotto} from "../src/Lotto.sol";

contract DeployLotto is Script {
    function run() external returns (Lotto) {
        address vrfCoordinator = vm.envAddress("VRF_COORDINATOR_V2");
        uint64 subscriptionId = uint64(vm.envUint("VRF_SUBSCRIPTION_ID"));
        bytes32 keyHash = vm.envBytes32("VRF_KEY_HASH");

        address payable treasury = _readTreasury();

        uint256 ticketPrice = 0.01 ether;
        try vm.envUint("LOTTO_TICKET_PRICE") returns (uint256 price) {
            ticketPrice = price;
        } catch {}

        uint16 feeBps = 500;
        try vm.envUint("LOTTO_FEE_BPS") returns (uint256 fee) {
            feeBps = uint16(fee);
        } catch {}

        (uint16 w1, uint16 w2, uint16 w3) = _readWeights();

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Lotto lotto = new Lotto(
            vrfCoordinator,
            subscriptionId,
            keyHash,
            treasury,
            ticketPrice,
            feeBps,
            w1,
            w2,
            w3
        );

        vm.stopBroadcast();

        console2.log("Lotto Contract Deployed at:", address(lotto));
        return lotto;
    }

    function _readTreasury() internal view returns (address payable) {
        try vm.envAddress("LOTTO_TREASURY") returns (address value) {
            return payable(value);
        } catch {}

        try vm.envAddress("TREASURY_ADDRESS") returns (address fallbackValue) {
            return payable(fallbackValue);
        } catch {}

        revert("Treasury address is not configured");
    }

    function _readWeights() internal view returns (uint16, uint16, uint16) {
        uint16 defaultW1 = 6000;
        uint16 defaultW2 = 2500;
        uint16 defaultW3 = 1500;

        uint16 w1 = defaultW1;
        uint16 w2 = defaultW2;
        uint16 w3 = defaultW3;

        try vm.envUint("LOTTO_WEIGHT_FIRST") returns (uint256 value) {
            w1 = uint16(value);
        } catch {}
        try vm.envUint("LOTTO_WEIGHT_SECOND") returns (uint256 value) {
            w2 = uint16(value);
        } catch {}
        try vm.envUint("LOTTO_WEIGHT_THIRD") returns (uint256 value) {
            w3 = uint16(value);
        } catch {}

        require(uint256(w1) + uint256(w2) + uint256(w3) <= 10_000, "Invalid weights");
        return (w1, w2, w3);
    }
}