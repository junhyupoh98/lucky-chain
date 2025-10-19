// node getStats.mjs

import { ethers } from 'ethers';

import contractConfig from './lib/contractConfig.mjs';
import lottoAbi from './lib/abi.json' assert { type: 'json' };

const { rpcUrl: RPC_URL, address: CONTRACT_ADDRESS } = contractConfig;

if (!RPC_URL) {
    throw new Error('RPC URL is not configured. Set NEXT_PUBLIC_LOTTO_RPC_URL, LOTTO_RPC_URL, RPC_URL, or KAIA_TESTNET_RPC_URL.');
}

if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address is not configured. Set NEXT_PUBLIC_LOTTO_ADDRESS, LOTTO_CONTRACT_ADDRESS, or CONTRACT_ADDRESS.');
}

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, lottoAbi, provider);

    const [nextTicketId, currentRoundId] = await Promise.all([
        contract.nextTicketId(),
        contract.currentRoundId(),
    ]);

    let activeRound;
    if (currentRoundId > 0n) {
        activeRound = await contract.getRoundInfo(currentRoundId);
    }

    console.log('\n--- Lucky Chain stats ---');
    console.log(`Total tickets minted: ${nextTicketId.toString()}`);
    if (activeRound) {
        console.log(`Current round: ${activeRound.id.toString()} (${['Sales', 'Drawing', 'Claimable'][Number(activeRound.phase)]})`);
        console.log(`Tickets sold this round: ${activeRound.ticketCount.toString()}`);
        console.log(`Gross sales: ${ethers.formatEther(activeRound.gross)} KAIA`);
        if (activeRound.winningNumbers && activeRound.winningNumbers.length > 0) {
            console.log(
                `Winning numbers: ${activeRound.winningNumbers.map((value) => Number(value)).join(', ')} | Lucky ${activeRound.luckyNumber}`,
            );
        }
    } else {
        console.log('No active round.');
    }
}

main().catch((error) => {
    console.error('Failed to fetch stats:', error);
    process.exitCode = 1;
});