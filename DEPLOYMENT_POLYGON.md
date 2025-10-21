# LottoV3 Deployment Guide for Polygon

This guide covers deploying the LottoV3 contract to Polygon mainnet.

## Prerequisites

1. **Foundry** installed and configured
2. **Private key** with MATIC for gas fees
3. **Chainlink VRF subscription** on Polygon
4. **Treasury wallet addresses** for team and gas fees

## Polygon Mainnet Configuration

### Network Details
- **Chain ID**: 137
- **RPC URL**: `https://polygon-rpc.com/` or `https://rpc-mainnet.matic.network`
- **Block Explorer**: https://polygonscan.com/

### Chainlink VRF V2 Configuration (Polygon Mainnet)
- **VRF Coordinator**: `0xAE975071Be8F8eE67addBC1A82488F1C24858067`
- **Key Hash (500 gwei)**: `0xcc294a196eeeb44da2888d17c0625cc88d70d9760a69d58d853ba6581a9ab0cd`
- **Key Hash (200 gwei)**: `0x6e099d640cde6de9d40ac749b4b594126b0169747122711109c9985d47751f93`
- **LINK Token**: `0xb0897686c545045aFc77CF20eC7A532E3120E0F1`

### Token Addresses (Polygon Mainnet)
- **USDT**: `0xc2132D05D31c914a87C6611C10748AEb04B58e8F` (6 decimals)
- **USDC**: `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174` (6 decimals)

## Deployment Steps

### 1. Set Up Environment Variables

Create a `.env` file in the `contracts` directory:

```bash
PRIVATE_KEY=your_private_key_here
POLYGON_RPC_URL=https://polygon-rpc.com/
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here

# Chainlink VRF Configuration
VRF_COORDINATOR=0xAE975071Be8F8eE67addBC1A82488F1C24858067
VRF_KEY_HASH=0xcc294a196eeeb44da2888d17c0625cc88d70d9760a69d58d853ba6581a9ab0cd
VRF_SUBSCRIPTION_ID=your_subscription_id_here

# Token Addresses
USDT_ADDRESS=0xc2132D05D31c914a87C6611C10748AEb04B58e8F
USDC_ADDRESS=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174

# Treasury Addresses
TEAM_TREASURY=your_team_treasury_address
GAS_TREASURY=your_gas_treasury_address
```

### 2. Create Chainlink VRF Subscription

1. Visit [Chainlink VRF Subscription Manager](https://vrf.chain.link/polygon)
2. Connect your wallet
3. Create a new subscription
4. Fund it with LINK tokens (recommended: at least 10 LINK)
5. Note your subscription ID

### 3. Create Deployment Script

Create `contracts/script/DeployLottoV3.s.sol`:

```solidity
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
```

### 4. Deploy Contract

```bash
cd contracts

# Dry run (simulation)
forge script script/DeployLottoV3.s.sol:DeployLottoV3 \
  --rpc-url $POLYGON_RPC_URL \
  --private-key $PRIVATE_KEY

# Actual deployment
forge script script/DeployLottoV3.s.sol:DeployLottoV3 \
  --rpc-url $POLYGON_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --etherscan-api-key $POLYGONSCAN_API_KEY
```

### 5. Add Contract as VRF Consumer

After deployment:

1. Go to [Chainlink VRF Subscription Manager](https://vrf.chain.link/polygon)
2. Select your subscription
3. Click "Add consumer"
4. Enter your deployed LottoV3 contract address
5. Confirm the transaction

### 6. Verify Deployment

```bash
# Check contract on Polygonscan
# Visit: https://polygonscan.com/address/YOUR_CONTRACT_ADDRESS

# Test contract interaction
cast call YOUR_CONTRACT_ADDRESS "currentRoundId()(uint256)" --rpc-url $POLYGON_RPC_URL
```

## Contract Configuration

### Default Fee Structure
- **Total Fee**: 15% (1500 bps)
  - Team Fee: 10% (1000 bps)
  - Gas Fee: 5% (500 bps)
- **Prize Distribution**: 85% (8500 bps)
  - 1st Prize: 70% (7000 bps)
  - 2nd Prize: 10% (1000 bps)
  - 3rd Prize: 20% (2000 bps)

### Updating Fee Configuration

```bash
# Example: Update fee configuration
cast send YOUR_CONTRACT_ADDRESS \
  "updateFeeConfig(uint16,uint16,uint16,uint16,uint16,uint16)" \
  1500 1000 500 7000 1000 2000 \
  --rpc-url $POLYGON_RPC_URL \
  --private-key $PRIVATE_KEY
```

## Post-Deployment Checklist

- [ ] Contract deployed successfully
- [ ] Contract verified on Polygonscan
- [ ] Contract added as VRF consumer
- [ ] VRF subscription funded with LINK
- [ ] First round started automatically
- [ ] Treasury addresses configured correctly
- [ ] Fee structure verified
- [ ] Test ticket purchase on testnet first

## Testing on Mumbai Testnet (Optional)

Before mainnet deployment, test on Mumbai testnet:

### Mumbai Configuration
- **Chain ID**: 80001
- **RPC URL**: `https://rpc-mumbai.maticvigil.com/`
- **VRF Coordinator**: `0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed`
- **Key Hash**: `0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f`
- **LINK Token**: `0x326C977E6efc84E512bB9C30f76E30c160eD06FB`
- **Test USDT**: Deploy your own or use existing test token
- **Test USDC**: Deploy your own or use existing test token

Get test MATIC from: https://faucet.polygon.technology/
Get test LINK from: https://faucets.chain.link/mumbai

## Gas Optimization Tips

1. **Batch Operations**: Use `buyTicketsAuto` for multiple tickets
2. **VRF Gas Limit**: Adjust `i_callbackGasLimit` if needed (default: 200,000)
3. **Off-peak Times**: Deploy during low network activity for lower gas costs

## Security Considerations

1. **Private Keys**: Never commit private keys to version control
2. **Treasury Addresses**: Use multi-sig wallets for treasury addresses
3. **VRF Subscription**: Keep subscription funded to ensure draws work
4. **Access Control**: Only owner can manage rounds and fees
5. **Audit**: Consider professional audit before mainnet deployment

## Troubleshooting

### VRF Request Fails
- Check subscription is funded with LINK
- Verify contract is added as consumer
- Ensure callback gas limit is sufficient

### Token Transfer Fails
- Verify USDT/USDC addresses are correct
- Check user has approved contract for token spending
- Ensure contract has correct token decimals (6 for USDT/USDC)

### Transaction Reverts
- Check round phase (must be Sales for purchases)
- Verify round timing (must be within start/end time)
- Ensure numbers are valid (1-45, sorted, no duplicates)

## Support

For issues or questions:
- Check Chainlink VRF documentation: https://docs.chain.link/vrf/v2/introduction
- Polygon documentation: https://docs.polygon.technology/
- Foundry documentation: https://book.getfoundry.sh/
