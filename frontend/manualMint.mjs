// node manualMint.mjs

import { ethers } from 'ethers';
import fetch from 'node-fetch';
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

function generateAutoTicket() {
    const picks = new Set();
    while (picks.size < 6) {
        picks.add(Math.floor(Math.random() * 45) + 1);
    }
    const numbers = Array.from(picks).sort((a, b) => a - b);
    let lucky = Math.floor(Math.random() * 45) + 1;
    while (picks.has(lucky)) {
        lucky = Math.floor(Math.random() * 45) + 1;
    }
    return { numbers, lucky };
}

async function main() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    const privateKey = await rl.question('Enter the private key to use for signing transactions: ');
    if (!privateKey || privateKey.trim().length === 0) {
        throw new Error('A private key is required.');
    }

    const modeAnswer = await rl.question('Choose ticket mode (manual/auto): ');
    const mode = modeAnswer.trim().toLowerCase() === 'auto' ? 'auto' : 'manual';

    let numbers;
    let luckyNumber;

    if (mode === 'manual') {
        const rawNumbers = await rl.question('Enter six unique numbers between 1 and 45 separated by commas: ');
        numbers = rawNumbers
            .split(',')
            .map((value) => Number.parseInt(value.trim(), 10))
            .filter((value) => Number.isInteger(value));

        if (numbers.length !== 6) {
            throw new Error('Exactly six numbers are required.');
        }
        if (new Set(numbers).size !== 6) {
            throw new Error('Numbers must be unique.');
        }
        if (numbers.some((value) => value < 1 || value > 45)) {
            throw new Error('Numbers must be between 1 and 45.');
        }

        const luckyAnswer = await rl.question('Enter a lucky number between 1 and 45: ');
        luckyNumber = Number.parseInt(luckyAnswer.trim(), 10);
        if (!Number.isInteger(luckyNumber) || luckyNumber < 1 || luckyNumber > 45) {
            throw new Error('Lucky number must be between 1 and 45.');
        }
        if (numbers.includes(luckyNumber)) {
            throw new Error('Lucky number must be different from the main numbers.');
        }
    } else {
        const autoTicket = generateAutoTicket();
        numbers = autoTicket.numbers;
        luckyNumber = autoTicket.lucky;
        console.log(`Auto numbers: ${numbers.join(', ')} | Lucky ${luckyNumber}`);
    }

    const drawId = await rl.question('Enter the active round ID: ');
    rl.close();

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(privateKey.trim(), provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, lottoAbi, signer);

    const ticketPrice = await contract.ticketPrice();

    console.log('\nUploading metadata to Pinata…');
    const response = await fetch('http://localhost:3000/api/uploadMetadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            numbers,
            luckyNumber,
            drawId,
            walletAddress: await signer.getAddress(),
            isAutoPick: mode === 'auto',
        }),
    });

    if (!response.ok) {
        throw new Error(`Metadata upload failed: ${await response.text()}`);
    }

    const { ipfsUri } = await response.json();
    console.log('Metadata uploaded:', ipfsUri);

    console.log('Submitting transaction…');
    const tx = await contract.buyTicket(numbers, luckyNumber, mode === 'auto', ipfsUri, {
        value: ticketPrice,
    });

    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt?.hash);

    const ticketPurchasedEvent = receipt?.logs?.find((log) => {
        try {
            const parsed = contract.interface.parseLog(log);
            return parsed && parsed.name === 'TicketPurchased';
        } catch {
            return false;
        }
    });

    if (ticketPurchasedEvent) {
        console.log('Ticket ID:', ticketPurchasedEvent.args.ticketId.toString());
    }
}

main().catch((error) => {
    console.error('Ticket purchase failed:', error);
    process.exitCode = 1;
});