// node readTokenData.mjs
// frontend/readTokenData.mjs (데이터 분석 도구 최종 버전)

import { ethers } from 'ethers';
import readline from 'readline/promises';

// --- ⚙️ 설정 ---
const RPC_URL = "https://public-en-kairos.node.kaia.io";
const CONTRACT_ADDRESS = "0x96C6bF9200C62e5e72F280ecCE01f4A4B3E011D0";
const LOTTO_CONTRACT_ABI = [
    "function nextTicketId() view returns (uint256)",
    "function purchaseTimestamps(uint256) view returns (uint256)",
    "function ticketToDraw(uint256) view returns (uint256)",
    "function ticketNumbers(uint256, uint256) view returns (uint8)"
];
// ------------

// --- 헬퍼 함수: 특정 ID의 모든 데이터를 가져오는 함수 ---
async function getTokenData(contract, ticketId) {
    try {
        // 여러 데이터를 한 번에 병렬로 요청해서 가져옵니다.
        const [timestamp, drawId] = await Promise.all([
            contract.purchaseTimestamps(ticketId),
            contract.ticketToDraw(ticketId)
        ]);
        
        // 로또 번호 6개를 순서대로 요청합니다.
        const numbersPromises = [];
        for (let i = 0; i < 6; i++) {
            numbersPromises.push(contract.ticketNumbers(ticketId, i));
        }
        const numbers = await Promise.all(numbersPromises);

        // 결과를 보기 좋게 객체로 만들어 반환합니다.
        return {
            id: ticketId,
            drawId: drawId.toString(),
            date: new Date(Number(timestamp) * 1000).toLocaleString('ko-KR'),
            numbers: `[${numbers.join(', ')}]`
        };
    } catch (error) {
        // ownerOf 조회 실패 등.. 존재하지 않는 토큰이면 null 반환
        return null; 
    }
}


// --- ✅ 메인 실행 함수 ---
async function main() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log("\n--- Kiwoom Lottery 데이터 조회 도구 ---");
    const choice = await rl.question(
        "❓ 어떤 작업을 하시겠습니까?\n" +
        "   1. 특정 티켓 ID 조회\n" +
        "   2. 가장 처음 발행된 티켓 10개 표시\n" +
        "   3. 가장 최근 발행된 티켓 10개 표시\n" +
        "   (번호 입력): "
    );

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, LOTTO_CONTRACT_ABI, provider);
    
    let ticketIdsToCheck = [];

    switch (choice.trim()) {
        case '1':
            const idAnswer = await rl.question('👉 조회할 티켓의 진짜 ID를 입력하세요: ');
            const singleId = parseInt(idAnswer, 10);
            if (!isNaN(singleId)) {
                ticketIdsToCheck.push(singleId);
            } else {
                console.error("❌ 유효한 숫자가 아닙니다.");
            }
            break;
            
        case '2':
            console.log("\n🔍 가장 처음 발행된 티켓 10개를 조회합니다...");
            for (let i = 0; i < 10; i++) {
                ticketIdsToCheck.push(i);
            }
            break;
            
        case '3':
            console.log("\n🔍 가장 최근 발행된 티켓 10개를 조회합니다...");
            const totalTickets = await contract.nextTicketId();
            const startId = Math.max(0, Number(totalTickets) - 10);
            for (let i = startId; i < totalTickets; i++) {
                ticketIdsToCheck.push(i);
            }
            if (totalTickets == 0) console.log("   (아직 발행된 티켓이 없습니다.)");
            break;
            
        default:
            console.log("🤷‍♀️ 잘못된 선택입니다.");
            break;
    }
    
    rl.close();

    if (ticketIdsToCheck.length > 0) {
        // 조회할 ID 목록의 데이터를 병렬로 한 번에 가져옵니다.
        const dataPromises = ticketIdsToCheck.map(id => getTokenData(contract, id));
        const results = await Promise.all(dataPromises);
        
        // 보기 좋게 테이블 형태로 출력합니다.
        console.table(results.filter(r => r !== null)); // 존재하지 않는 토큰(null)은 제외
    }
}

main();