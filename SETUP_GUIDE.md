# Lucky Chain V2 완전 설정 가이드

## 📋 목차

1. [로컬 개발 환경 설정](#로컬-개발-환경-설정)
2. [테스트넷 배포](#테스트넷-배포)
3. [프론트엔드 설정](#프론트엔드-설정)
4. [MetaMask 설정](#metamask-설정)
5. [문제 해결](#문제-해결)

---

## 🚀 로컬 개발 환경 설정

### 사전 요구사항

- **Node.js** 18.x 이상
- **Git**
- **Foundry** (자동 설치됨)

### 1단계: 저장소 클론

```bash
# 저장소 클론
git clone https://github.com/junhyupoh98/lucky-chain.git
cd lucky-chain

# 새 브랜치로 전환 (V2 코드)
git checkout devin/1760968012-lotto-v2-usdt-usdc-auto-numbers-korean
```

### 2단계: 자동 설정 스크립트 실행

```bash
# 스크립트 실행 권한 부여
chmod +x setup-local.sh

# 자동 설정 실행
./setup-local.sh
```

이 스크립트는 다음을 수행합니다:
- ✅ Foundry 설치 확인 및 설치
- ✅ 컨트랙트 의존성 설치
- ✅ 컨트랙트 컴파일 및 테스트
- ✅ 프론트엔드 의존성 설치
- ✅ V2 페이지를 메인 페이지로 설정

### 3단계: 로컬 블록체인 시작

**터미널 1** - Anvil 실행:
```bash
cd contracts
anvil
```

Anvil이 시작되면 다음 정보가 표시됩니다:
- 10개의 테스트 계정 (각각 10,000 ETH)
- 기본 RPC: `http://localhost:8545`
- Chain ID: `31337`

**중요**: 첫 번째 계정의 개인키를 복사해두세요:
```
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### 4단계: 로컬 배포

**터미널 2** - 컨트랙트 배포:
```bash
# 배포 스크립트 실행
./deploy-local.sh
```

이 스크립트는 다음을 수행합니다:
- ✅ Mock USDT/USDC 토큰 배포
- ✅ LottoV2 컨트랙트 배포
- ✅ 프론트엔드 환경 변수 자동 설정
- ✅ 관리자 설정 파일 생성

배포가 완료되면 다음 주소들이 표시됩니다:
```
Mock USDT: 0x...
Mock USDC: 0x...
LottoV2:   0x...
```

### 5단계: 프론트엔드 실행

**터미널 3** - 프론트엔드 시작:
```bash
cd frontend
npm run dev
```

브라우저에서 http://localhost:3000 접속

---

## 🌐 테스트넷 배포

### 사전 준비

1. **Kaia Kairos 테스트넷 KAIA 받기**
   - Faucet: https://faucet.kaia.io/
   - 배포 및 테스트에 필요

2. **테스트넷 USDT/USDC 주소 확인**
   - Kaia Kairos에 배포된 USDT/USDC 주소 필요
   - 없다면 Mock 토큰을 직접 배포해야 함

### 1단계: 환경 변수 설정

```bash
cd contracts

# .env 파일이 없다면 스크립트가 자동 생성
# 있다면 직접 편집
nano .env
```

필수 입력 항목:
```bash
# 배포자 개인키 (절대 공유하지 마세요!)
PRIVATE_KEY=0x...

# USDT/USDC 주소 (테스트넷)
USDT_ADDRESS=0x...
USDC_ADDRESS=0x...

# 수수료 수령 주소
TREASURY_ADDRESS=0x...
```

### 2단계: 테스트넷 배포 실행

```bash
# 루트 디렉토리로 이동
cd ..

# 배포 스크립트 실행
./deploy-testnet.sh
```

스크립트는 다음을 수행합니다:
1. ✅ 환경 변수 검증
2. ✅ 컨트랙트 컴파일 및 테스트
3. ✅ Kaia Kairos 테스트넷에 배포
4. ✅ 프론트엔드 환경 변수 자동 설정
5. ✅ 프론트엔드 빌드

### 3단계: Chainlink VRF 설정

1. https://vrf.chain.link/ 방문
2. Kaia Kairos 네트워크 선택
3. 기존 구독 사용 또는 새로 생성
4. 배포된 LottoV2 주소를 컨슈머로 추가
5. LINK 토큰 충전 (최소 5 LINK 권장)

### 4단계: 관리자 주소 설정

```bash
# adminConfig.ts 편집
nano frontend/lib/adminConfig.ts
```

관리자 주소 추가:
```typescript
export const allowedAdminAddresses = [
    '0x당신의_지갑_주소',
    '0x다른_관리자_주소', // 선택사항
];
```

### 5단계: 프론트엔드 실행

```bash
cd frontend

# 로컬 테스트
npm run dev

# 또는 프로덕션 배포 (Vercel)
vercel --prod
```

---

## 🎨 프론트엔드 설정

### 환경 변수 설명

**로컬 개발** (`.env.local`):
```bash
# 로컬 Anvil
NEXT_PUBLIC_LOTTO_ADDRESS=0x...      # LottoV2 주소
NEXT_PUBLIC_USDT_ADDRESS=0x...       # Mock USDT 주소
NEXT_PUBLIC_USDC_ADDRESS=0x...       # Mock USDC 주소
NEXT_PUBLIC_LOTTO_CHAIN_ID=31337     # Anvil Chain ID
NEXT_PUBLIC_LOTTO_RPC_URL=http://localhost:8545
```

**테스트넷** (`.env.local`):
```bash
# Kaia Kairos
NEXT_PUBLIC_LOTTO_ADDRESS=0x...      # 배포된 LottoV2 주소
NEXT_PUBLIC_USDT_ADDRESS=0x...       # 테스트넷 USDT 주소
NEXT_PUBLIC_USDC_ADDRESS=0x...       # 테스트넷 USDC 주소
NEXT_PUBLIC_LOTTO_CHAIN_ID=1001      # Kaia Kairos Chain ID
NEXT_PUBLIC_LOTTO_RPC_URL=https://public-en-kairos.node.kaia.io
```

### 페이지 구조

- **메인 페이지** (`/`): 티켓 구매 및 사용자 대시보드
- **관리자 페이지** (`/admin`): 회차 관리 (관리자만 접근)

---

## 🦊 MetaMask 설정

### 로컬 개발용 (Anvil)

1. **네트워크 추가**:
   - 네트워크 이름: `Localhost 8545`
   - RPC URL: `http://localhost:8545`
   - 체인 ID: `31337`
   - 통화 기호: `ETH`

2. **테스트 계정 가져오기**:
   - MetaMask > 계정 가져오기
   - 개인키 입력: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - 이 계정은 10,000 ETH와 1,000 USDT/USDC를 보유

### 테스트넷용 (Kaia Kairos)

1. **네트워크 추가**:
   - 네트워크 이름: `Kaia Kairos Testnet`
   - RPC URL: `https://public-en-kairos.node.kaia.io`
   - 체인 ID: `1001`
   - 통화 기호: `KAIA`
   - 블록 탐색기: `https://kairos.kaiascope.com`

2. **테스트 KAIA 받기**:
   - https://faucet.kaia.io/ 방문
   - 지갑 주소 입력 및 요청

---

## 🔧 문제 해결

### 컨트랙트 관련

**문제**: `forge: command not found`
```bash
# Foundry 설치
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc
foundryup
```

**문제**: 컴파일 실패
```bash
# 의존성 재설치
cd contracts
rm -rf lib/
forge install
forge build
```

**문제**: 테스트 실패
```bash
# 상세 로그 확인
forge test -vvvv

# 특정 테스트만 실행
forge test --match-test testBuyTicket -vvv
```

### 프론트엔드 관련

**문제**: `npm install` 실패
```bash
# 캐시 정리 후 재시도
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**문제**: 빌드 에러 - BigInt 관련
```bash
# tsconfig.json의 target이 ES2020인지 확인
# 이미 수정되어 있어야 함
cat frontend/tsconfig.json | grep target
```

**문제**: 지갑 연결 안 됨
- MetaMask가 올바른 네트워크에 연결되어 있는지 확인
- 브라우저 콘솔에서 에러 메시지 확인
- 페이지 새로고침 시도

### 배포 관련

**문제**: 가스 부족
```bash
# 지갑에 충분한 KAIA/ETH가 있는지 확인
cast balance 0x당신의_주소 --rpc-url $RPC_URL
```

**문제**: VRF 설정 오류
- Chainlink VRF 구독이 활성화되어 있는지 확인
- LottoV2 주소가 컨슈머로 추가되었는지 확인
- 충분한 LINK 토큰이 있는지 확인

**문제**: 토큰 승인 실패
- USDT/USDC 잔액 확인
- 가스비용 지불을 위한 KAIA/ETH 확인
- 네트워크 혼잡 시 가스 가격 증가 시도

---

## 📝 빠른 참조

### 유용한 명령어

```bash
# 컨트랙트 컴파일
cd contracts && forge build

# 테스트 실행
forge test

# 특정 테스트 실행
forge test --match-test testBuyTicket -vvv

# 가스 리포트
forge test --gas-report

# 프론트엔드 개발 서버
cd frontend && npm run dev

# 프론트엔드 빌드
npm run build

# 프론트엔드 프로덕션 실행
npm start
```

### 주요 파일 위치

```
lucky-chain/
├── setup-local.sh          # 로컬 환경 자동 설정
├── deploy-local.sh         # 로컬 배포 스크립트
├── deploy-testnet.sh       # 테스트넷 배포 스크립트
├── contracts/
│   ├── src/
│   │   ├── LottoV2.sol    # 메인 컨트랙트
│   │   └── mocks/
│   │       └── MockERC20.sol
│   ├── script/
│   │   ├── DeployLottoV2.s.sol
│   │   └── DeployMockTokens.s.sol
│   └── test/
│       └── LottoV2.t.sol  # 테스트
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx         # 메인 페이지 (V2)
    │   │   └── admin/
    │   │       └── page.tsx     # 관리자 페이지
    │   └── hooks/
    │       └── useLottoV2Contract.tsx
    └── lib/
        └── adminConfig.ts       # 관리자 주소 설정
```

---

## 🎯 다음 단계

### 로컬 개발 완료 후
1. ✅ 티켓 구매 테스트
2. ✅ 토큰 승인 플로우 확인
3. ✅ 관리자 기능 테스트
4. ✅ 모바일 반응형 확인

### 테스트넷 배포 완료 후
1. ✅ Chainlink VRF 설정
2. ✅ 실제 사용자 플로우 테스트
3. ✅ 가스 비용 최적화 확인
4. ✅ 보안 감사 (메인넷 전)

### 프로덕션 배포 전
1. ✅ 전체 기능 테스트
2. ✅ 보안 감사
3. ✅ 가스 최적화
4. ✅ 프론트엔드 성능 최적화
5. ✅ 모니터링 설정

---

## 📞 지원

문제가 발생하면:
1. 이 가이드의 문제 해결 섹션 확인
2. GitHub Issues에 문제 보고
3. 로그 파일 첨부 (개인키 제외!)

---

## 🔒 보안 주의사항

⚠️ **절대 하지 말아야 할 것**:
- ❌ 개인키를 코드에 하드코딩
- ❌ `.env` 파일을 git에 커밋
- ❌ 개인키를 다른 사람과 공유
- ❌ 테스트넷 주소를 메인넷에 사용

✅ **반드시 해야 할 것**:
- ✅ `.env` 파일을 `.gitignore`에 추가
- ✅ 프로덕션 개인키는 별도 관리
- ✅ 관리자 권한 최소화
- ✅ 메인넷 배포 전 보안 감사

---

## 📄 라이선스

MIT License
