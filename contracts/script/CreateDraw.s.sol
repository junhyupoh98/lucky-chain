// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {Lotto} from "../src/Lotto.sol";

contract ManageRounds is Script {
    function run() external {
        address contractAddress = vm.envAddress("LOTTO_CONTRACT_ADDRESS");
        Lotto lotto = Lotto(contractAddress);

        uint256 adminKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(adminKey);

        bool closed = true;
        try lotto.closeCurrentRound() {
            console2.log("Closed active round", lotto.currentRoundId() - 1);
        } catch {
            closed = false;
            console2.log("Active round not ready to close");
        }

        if (!closed) {
            Lotto.RoundView memory roundInfo = lotto.getRoundInfo(lotto.currentRoundId());
            if (uint256(roundInfo.phase) == uint256(Lotto.Phase.Sales)) {
                vm.stopBroadcast();
                console2.log("Skipping new round: current round still selling");
                return;
            }
        }

        uint64 startTime = uint64(block.timestamp);
        try vm.envUint("LOTTO_NEXT_ROUND_START") returns (uint256 value) {
            startTime = uint64(value);
        } catch {}

        uint256 newRoundId = lotto.startNextRound(startTime);
        console2.log("Started round", newRoundId);

        vm.stopBroadcast();
    }
}