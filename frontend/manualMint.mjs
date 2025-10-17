
// npm run dev
// node manualMint.mjs
// frontend/manualMint.mjs (중복 제거 최종 버전)

import { ethers } from 'ethers';
import fetch from 'node-fetch';
import readline from 'readline/promises';
import contractConfig from './lib/contractConfig.mjs';
import lottoAbi from './lib/abi.json' assert { type: 'json' };

// --- ⚙️ 설정: 환경 변수에서 값을 불러옵니다 ---
const { rpcUrl: KAIA_TESTNET_RPC_URL, address: LOTTO_CONTRACT_ADDRESS } = contractConfig;
const YOUR_PRIVATE_KEY = "8f48072ce4eeba6f4db667db7c9b1ef67a84663696e966952a33b578a45f971e";

if (!KAIA_TESTNET_RPC_URL) {
    throw new Error('RPC URL is not configured. Set NEXT_PUBLIC_LOTTO_RPC_URL, LOTTO_RPC_URL, RPC_URL, or KAIA_TESTNET_RPC_URL.');
}

if (!LOTTO_CONTRACT_ADDRESS) {
    throw new Error('Contract address is not configured. Set NEXT_PUBLIC_LOTTO_ADDRESS, LOTTO_CONTRACT_ADDRESS, or CONTRACT_ADDRESS.');
}
const LOTTO_CONTRACT_ABI = lottoAbi;

// ---------------------------------------------

// --- 헬퍼 함수들 (Helper Functions) ---
function generateRandomNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return [...numbers];
}

async function getSingleLine(rl, lineNumber) {
    const answer = await rl.question(`\n👉 ${lineNumber}번째 줄 번호 6개를 콤마(,)로 입력하세요.\n   (랜덤 생성을 원하시면 그냥 Enter): `);
    
    if (answer.trim() === '') {
        const randomNumbers = generateRandomNumbers();
        console.log(`✨ 생성된 랜덤 번호: [${randomNumbers.join(', ')}]`);
        return randomNumbers;
    }

    const userNumbers = answer.split(',').map(numStr => parseInt(numStr.trim(), 10));

    if (userNumbers.length !== 6 || userNumbers.some(isNaN)) {
        console.error("❌ 오류: 정확히 6개의 '숫자'를 입력해야 합니다."); return null;
    }
    if (userNumbers.some(num => num < 1 || num > 45)) {
        console.error("❌ 오류: 모든 번호는 1과 45 사이여야 합니다."); return null;
    }
    if (new Set(userNumbers).size !== 6) {
        console.error("❌ 오류: 중복된 번호를 입력할 수 없습니다."); return null;
    }
    
    return userNumbers;
}

// --- ✅ 메인 실행 함수 (Main Function) ---
async function main() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    
    const linesToBuyAnswer = await rl.question('❓ 몇 줄의 로또를 구매하시겠습니까? (숫자 입력): ');
    const linesToBuy = parseInt(linesToBuyAnswer, 10);
    if (isNaN(linesToBuy) || linesToBuy <= 0) {
        console.error("❌ 오류: 유효한 숫자를 입력해야 합니다.");
        rl.close();
        return;
    }
    
    const allLottoNumbers = [];
    for (let i = 0; i < linesToBuy; i++) {
        const line = await getSingleLine(rl, i + 1);
        if (!line) {
            rl.close();
            return;
        }
        allLottoNumbers.push(line);
    }
    rl.close();
    
    const drawNumber = 80;
    console.log(`\n🚀 총 ${linesToBuy}줄의 NFT 발행 절차를 시작합니다...`);

    try {
        const provider = new ethers.JsonRpcProvider(KAIA_TESTNET_RPC_URL);
        const signer = new ethers.Wallet(YOUR_PRIVATE_KEY, provider);
        const lottoContract = new ethers.Contract(LOTTO_CONTRACT_ADDRESS, LOTTO_CONTRACT_ABI, signer);
        const ticketPrice = await lottoContract.ticketPrice();
        
        for (let i = 0; i < linesToBuy; i++) {
            const numbers = allLottoNumbers[i];
            console.log(`\n--- [ ${i + 1} / ${linesToBuy} 번째 줄 발행 중: [${numbers.join(', ')}] ] ---`);
            
            console.log("✅ Step 1: API를 통해 메타데이터를 생성합니다...");
            const response = await fetch('http://localhost:3000/api/uploadMetadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    numbers: numbers,
                    drawNumber: drawNumber,
                    ticketId: `ticket_${Date.now()}` 
                }),
            });
            if (!response.ok) throw new Error(`API 호출 실패: ${await response.text()}`);
            const data = await response.json();
            const tokenURI = data.ipfsUri;
            console.log("✅ Step 2: 메타데이터 URI를 성공적으로 받았습니다.");
            
            console.log("✅ Step 3: 스마트 컨트랙트의 buyTicket 함수를 호출합니다...");
            const tx = await lottoContract.buyTicket(numbers, tokenURI, { value: ticketPrice });
            console.log("...블록체인의 확인을 기다리는 중...");
            const receipt = await tx.wait();
            
            // ethers v6에서 이벤트 로그를 찾는 더 안정적인 방법
            const purchasedEvent = receipt.logs.find(log => {
                try {
                    const parsedLog = lottoContract.interface.parseLog(log);
                    return parsedLog && parsedLog.name === 'TicketPurchased';
                } catch (e) {
                    return false;
                }
            });

            if (purchasedEvent) {
                const realTokenId = purchasedEvent.args.ticketId.toString();
                console.log(`✅ 성공! NFT Ticket #${realTokenId} (진짜 ID)가 발행되었습니다.`);
                console.log(`   (Tx Hash: ${tx.hash})`);
            } else {
                    console.log(`✅ 성공! 트랜잭션은 완료되었지만 TicketPurchased 이벤트를 찾지 못했습니다.`);
                    console.log(`   (Tx Hash: ${tx.hash})`);
            }
        }

        console.log("\n🎉🎉🎉 SUCCESS! 🎉🎉🎉");
        console.log(`총 ${linesToBuy}개의 NFT 티켓 발행이 모두 완료되었습니다!`);

    } catch (error) {
        console.error("\n❌ 발행 과정 중 오류가 발생했습니다:", error.message);
    }
}

main();