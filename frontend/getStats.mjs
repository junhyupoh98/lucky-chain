// node getStats.mjs
// frontend/getStats.mjs

import { ethers } from 'ethers';

// --- 설정 ---
const RPC_URL = "https://public-en-kairos.node.kaia.io";
const CONTRACT_ADDRESS = "0x96C6bF9200C62e5e72F280ecCE01f4A4B3E011D0";
const LOTTO_CONTRACT_ABI = [
    "function nextTicketId() view returns (uint256)"
];
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