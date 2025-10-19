// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {Lotto} from "../src/Lotto.sol";

contract BuyTicket is Script {
    function run() external {
        address contractAddress;
        try vm.envAddress("LOTTO_CONTRACT_ADDRESS") returns (address value) {
            contractAddress = value;
        } catch {
            contractAddress = vm.envAddress("CONTRACT_ADDRESS");
        }
        Lotto lotto = Lotto(contractAddress);

        uint8[6] memory selectedNumbers = [uint8(3), 8, 14, 21, 32, 44];
        uint8 luckyNumber = 5;
        bool isAutoPick = false;

        string memory tokenUri = "ipfs://example-ticket";
        try vm.envString("LOTTO_METADATA_URI") returns (string memory provided) {
            tokenUri = provided;
        } catch {}

        uint256 price = lotto.ticketPrice();

        uint256 buyerKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(buyerKey);

        lotto.buyTicket{value: price}(selectedNumbers, luckyNumber, isAutoPick, tokenUri);

        vm.stopBroadcast();

        console2.log("Ticket purchased with lucky number", luckyNumber);
    }
}