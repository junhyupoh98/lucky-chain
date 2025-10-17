// node getStats.mjs
// frontend/getStats.mjs

import { ethers } from 'ethers';
import contractConfig from './lib/contractConfig.mjs';
import lottoAbi from './lib/abi.json' assert { type: 'json' };

// --- 설정 ---
const { rpcUrl: RPC_URL, address: CONTRACT_ADDRESS } = contractConfig;
const LOTTO_CONTRACT_ABI = lottoAbi;

if (!RPC_URL) {
    throw new Error('RPC URL is not configured. Set NEXT_PUBLIC_LOTTO_RPC_URL, LOTTO_RPC_URL, RPC_URL, or KAIA_TESTNET_RPC_URL.');
}

if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address is not configured. Set NEXT_PUBLIC_LOTTO_ADDRESS, LOTTO_CONTRACT_ADDRESS, or CONTRACT_ADDRESS.');
}
// ------------

async function main() {
    console.log(`\n📊 스마트 컨트랙트의 현재 상태를 조회합니다...`);
    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, LOTTO_CONTRACT_ABI, provider);

        const nextId = await contract.nextTicketId();

        console.log("\n--- ✅ Kiwoom Lottery 현황 ---");
        console.log(`- 지금까지 발행된 총 티켓 수: ${nextId.toString()} 개`);
        console.log(`- 다음에 발행될 티켓의 ID:    ${nextId.toString()}`);
        console.log("------------------------------");

    } catch (error) {
        console.error("\n❌ 데이터를 조회하는 중 오류가 발생했습니다:", error.message);
    }
}

main();