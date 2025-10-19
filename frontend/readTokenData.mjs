// node readTokenData.mjs

import { ethers } from 'ethers';
import readline from 'readline/promises';

import contractConfig from './lib/contractConfig.mjs';
import lottoAbi from './lib/abi.json' assert { type: 'json' };

const { rpcUrl: RPC_URL, address: CONTRACT_ADDRESS } = contractConfig;

if (!RPC_URL) {
    throw new Error('RPC URL is not configured. Set NEXT_PUBLIC_LOTTO_RPC_URL, LOTTO_RPC_URL, RPC_URL, or KAIA_TESTNET_RPC_URL.');
}

if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address is not configured. Set NEXT_PUBLIC_LOTTO_ADDRESS, LOTTO_CONTRACT_ADDRESS, or CONTRACT_ADDRESS.');
}

async function getTicketInfo(contract, ticketId) {
    try {
        const info = await contract.getTicketInfo(BigInt(ticketId));
        return {
            id: ticketId,
            roundId: info.roundId.toString(),
            purchasedAt: new Date(Number(info.purchasedAt) * 1000).toISOString(),
            numbers: info.numbers.map((value) => Number(value)).join(', '),
            luckyNumber: Number(info.luckyNumber),
            mode: info.isAutoPick ? 'Auto' : 'Manual',
            tier: Number(info.tier),
            claimed: info.claimed,
        };
    } catch {
        return null;
    }
}

async function main() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log('\n--- Lucky Chain ticket inspector ---');
    const choice = await rl.question(
        'Select an option:\n'
        + '  1. Inspect a specific ticket ID\n'
        + '  2. Show the first 10 tickets\n'
        + '  3. Show the latest 10 tickets\n'
        + 'Enter selection: ',
    );

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, lottoAbi, provider);

    let ticketIds = [];

    switch (choice.trim()) {
        case '1': {
            const idAnswer = await rl.question('Enter the ticket ID: ');
            const id = Number.parseInt(idAnswer, 10);
            if (Number.isFinite(id)) {
                ticketIds.push(id);
            }
            break;
        }
        case '2':
            ticketIds = Array.from({ length: 10 }, (_, index) => index);
            break;
        case '3': {
            const total = await contract.nextTicketId();
            const start = Number(total) - 10;
            for (let i = Math.max(0, start); i < Number(total); i += 1) {
                ticketIds.push(i);
            }
            if (Number(total) === 0) {
                console.log('No tickets minted yet.');
            }
            break;
        }
        default:
            console.log('Invalid choice.');
    }

    rl.close();

    if (ticketIds.length === 0) {
        return;
    }

    const results = await Promise.all(ticketIds.map((id) => getTicketInfo(contract, id)));
    console.table(results.filter(Boolean));
}

main().catch((error) => {
    console.error('Failed to fetch ticket data:', error);
    process.exitCode = 1;
});