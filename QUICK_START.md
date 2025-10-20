# 🚀 Lucky Chain V2 - 빠른 시작 카드

## 📥 처음 시작하기

```bash
# 1. 저장소 클론
git clone https://github.com/junhyupoh98/lucky-chain.git
cd lucky-chain

# 2. V2 브랜치로 전환
git checkout devin/1760968012-lotto-v2-usdt-usdc-auto-numbers-korean

# 3. 자동 설정 실행
./setup-local.sh
```

---

## 💻 로컬 개발 (3개 터미널)

### 터미널 1: Anvil
```bash
cd contracts
anvil
```

### 터미널 2: 배포
```bash
./deploy-local.sh
```

### 터미널 3: 프론트엔드
```bash
cd frontend
npm run dev
```

### 브라우저
```
http://localhost:3000
```

---

## 🌐 테스트넷 배포

### 1단계: Mock 토큰 배포 (선택사항)
```bash
./deploy-mock-tokens-testnet.sh
```

### 2단계: 환경 변수 설정
```bash
cd contracts
nano .env
```

필수 입력:
```bash
PRIVATE_KEY=0x...
USDT_ADDRESS=0x...
USDC_ADDRESS=0x...
TREASURY_ADDRESS=0x...
```

### 3단계: 배포
```bash
cd ..
./deploy-testnet.sh
```

### 4단계: Chainlink VRF 설정
1. https://vrf.chain.link/ 방문
2. 배포된 LottoV2 주소를 컨슈머로 추가
3. LINK 토큰 충전

### 5단계: 관리자 설정
```bash
nano frontend/lib/adminConfig.ts
```

```typescript
export const allowedAdminAddresses = [
    '0x당신의_주소',
];
```

### 6단계: 실행
```bash
cd frontend
npm run dev
```

---

## 🦊 MetaMask 설정

### 로컬 (Anvil)
- **네트워크**: Localhost 8545
- **RPC**: http://localhost:8545
- **Chain ID**: 31337
- **개인키**: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

### 테스트넷 (Kaia Kairos)
- **네트워크**: Kaia Kairos Testnet
- **RPC**: https://public-en-kairos.node.kaia.io
- **Chain ID**: 1001
- **Faucet**: https://faucet.kaia.io/

---

## 🔧 유용한 명령어

### 컨트랙트
```bash
cd contracts
forge build          # 컴파일
forge test           # 테스트
forge test -vvv      # 상세 테스트
```

### 프론트엔드
```bash
cd frontend
npm run dev          # 개발 서버
npm run build        # 빌드
npm start            # 프로덕션 실행
```

---

## 📚 상세 문서

- **[완전 설정 가이드](SETUP_GUIDE.md)** - 전체 설정 방법
- **[스크립트 가이드](SCRIPTS_README.md)** - 스크립트 상세 설명
- **[배포 가이드](DEPLOYMENT.md)** - 배포 정보
- **[README](README.md)** - 프로젝트 개요

---

## ❓ 문제 해결

### 스크립트 실행 안 됨
```bash
chmod +x setup-local.sh deploy-local.sh deploy-testnet.sh
```

### Foundry 없음
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 지갑 연결 안 됨
- MetaMask 네트워크 확인
- 페이지 새로고침
- 브라우저 콘솔 확인

---

## 🎯 체크리스트

### 로컬 개발
- [ ] `setup-local.sh` 실행
- [ ] Anvil 시작
- [ ] `deploy-local.sh` 실행
- [ ] MetaMask 설정 (Chain ID 31337)
- [ ] 프론트엔드 실행
- [ ] 티켓 구매 테스트

### 테스트넷 배포
- [ ] 테스트넷 KAIA 받기
- [ ] Mock 토큰 배포 (필요시)
- [ ] `.env` 파일 설정
- [ ] `deploy-testnet.sh` 실행
- [ ] Chainlink VRF 설정
- [ ] 관리자 주소 설정
- [ ] 전체 플로우 테스트

---

**더 자세한 내용은 [SETUP_GUIDE.md](SETUP_GUIDE.md)를 참조하세요!**
