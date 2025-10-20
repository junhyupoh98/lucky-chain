// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {MockERC20} from "../src/mocks/MockERC20.sol";

contract DeployMockTokens is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy Mock USDT (6 decimals)
        MockERC20 usdt = new MockERC20("Tether USD", "USDT", 6);
        console.log("Mock USDT deployed at:", address(usdt));

        // Deploy Mock USDC (6 decimals)
        MockERC20 usdc = new MockERC20("USD Coin", "USDC", 6);
        console.log("Mock USDC deployed at:", address(usdc));

        // Mint 1000 USDT and USDC to deployer
        usdt.mint(msg.sender, 1000e6);
        usdc.mint(msg.sender, 1000e6);
        
        console.log("Minted 1000 USDT and 1000 USDC to:", msg.sender);

        vm.stopBroadcast();
    }
}
