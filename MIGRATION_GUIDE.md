# Lucky Chain V1 → V2 마이그레이션 가이드

이 가이드는 기존 Lucky Chain V1 프로젝트를 V2로 업그레이드하는 방법을 설명합니다.

---

## 🔄 변경 사항 요약

### 스마트 컨트랙트
- **V1**: 네이티브 토큰(ETH/KAIA) 결제
- **V2**: USDT/USDC ERC20 토큰 결제, $1 고정 가격

### 프론트엔드
- **V1**: 수동 번호 입력, 영어 UI
- **V2**: 자동 번호 생성, 완전한 한국어 UI

---

## 📋 마이그레이션 체크리스트

### 1단계: 브랜치 전환
```bash
cd /path/to/lucky-chain
git fetch origin
git checkout devin/1760968012-lotto-v2-usdt-usdc-auto-numbers-korean
git pull origin devin/1760968012-lotto-v2-usdt-usdc-auto-numbers-korean
```

### 2단계: 프론트엔드 파일 업데이트

다음 파일들을 V2 버전으로 교체해야 합니다:

#### ✅ 필수 변경 파일

1. **`frontend/src/app/providers.tsx`**
   ```typescript
   // 변경 전 (V1)
   import { LottoContractProvider } from '@/hooks/useLottoContract';
   
   // 변경 후 (V2)
   import { LottoV2ContractProvider } from '@/hooks/useLottoV2Contract';
   
   export function AppProviders({ children }: { children: ReactNode }) {
       return <LottoV2ContractProvider>{children}</LottoV2ContractProvider>;
   }
   ```

2. **`frontend/src/app/page.tsx`**
   ```bash
   # pageV2.tsx를 page.tsx로 복사
   cp frontend/src/app/pageV2.tsx frontend/src/app/page.tsx
   ```

3. **`frontend/src/app/admin/page.tsx`**
   ```bash
   # pageV2.tsx를 page.tsx로 복사
   cp frontend/src/app/admin/pageV2.tsx frontend/src/app/admin/page.tsx
   ```

#### 📝 새로 생성된 파일

- `frontend/src/hooks/useLottoV2Contract.tsx` - V2 컨트랙트 훅
- `frontend/lib/abiV2.json` - V2 컨트랙트 ABI
- `frontend/src/app/pageV2.tsx` - V2 메인 페이지
- `frontend/src/app/providersV2.tsx` - V2 프로바이더
- `frontend/src/app/admin/pageV2.tsx` - V2 관리자 페이지

### 3단계: 환경 변수 설정

#### 로컬 개발 (`.env.local`)
```bash
# V2 컨트랙트 주소 (deploy-local.sh 실행 후 자동 생성됨)
NEXT_PUBLIC_LOTTO_ADDRESS=0x...
NEXT_PUBLIC_USDT_ADDRESS=0x...
NEXT_PUBLIC_USDC_ADDRESS=0x...
NEXT_PUBLIC_LOTTO_CHAIN_ID=31337
NEXT_PUBLIC_LOTTO_RPC_URL=http://localhost:8545
```

#### 테스트넷 (`.env.local`)
```bash
# V2 컨트랙트 주소 (deploy-testnet.sh 실행 후 자동 생성됨)
NEXT_PUBLIC_LOTTO_ADDRESS=0x...
NEXT_PUBLIC_USDT_ADDRESS=0x...
NEXT_PUBLIC_USDC_ADDRESS=0x...
NEXT_PUBLIC_LOTTO_CHAIN_ID=1001
NEXT_PUBLIC_LOTTO_RPC_URL=https://public-en-kairos.node.kaia.io
```

### 4단계: 관리자 설정

`frontend/lib/adminConfig.ts` 파일 생성:
```typescript
export const allowedAdminAddresses = [
    '0x당신의_관리자_주소',
];
```

### 5단계: 의존성 재설치

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 빠른 마이그레이션 (자동화)

### 방법 1: 자동화 스크립트 사용

```bash
# 1. 환경 설정
./setup-local.sh

# 2. 로컬 배포 (Anvil 실행 중이어야 함)
./deploy-local.sh

# 3. 프론트엔드 실행
cd frontend && npm run dev
```

### 방법 2: 수동 마이그레이션

```bash
# 1. 프론트엔드 파일 업데이트
cd frontend/src/app

# providers.tsx 수정
nano providers.tsx
# LottoContractProvider → LottoV2ContractProvider로 변경

# page.tsx 교체
cp pageV2.tsx page.tsx

# admin/page.tsx 교체
cp admin/pageV2.tsx admin/page.tsx

# 2. 환경 변수 설정
cd ../..
nano .env.local
# 필요한 주소들 입력

# 3. 빌드 및 실행
npm install
npm run dev
```

---

## 🔍 변경 사항 상세

### 컨트랙트 변경

#### V1 (Lotto.sol)
```solidity
// 네이티브 토큰 결제
function buyTicket(uint8[6] memory _numbers) external payable {
    require(msg.value >= ticketPrice, "Insufficient payment");
    // ...
}
```

#### V2 (LottoV2.sol)
```solidity
// ERC20 토큰 결제 + 자동 번호 생성
function buyTickets(TokenType tokenType, uint256 amount) external {
    IERC20 token = tokenType == TokenType.USDT ? usdt : usdc;
    token.transferFrom(msg.sender, address(this), TICKET_PRICE * amount);
    // 자동으로 번호 생성
    // ...
}
```

### 프론트엔드 변경

#### V1 Hook (useLottoContract.tsx)
```typescript
// 수동 번호 입력
const buyTicket = async (numbers: number[]) => {
    await contract.buyTicket(numbers, { value: ticketPrice });
};
```

#### V2 Hook (useLottoV2Contract.tsx)
```typescript
// 자동 번호 생성, 토큰 승인 필요
const buyTickets = async (tokenType: 'USDT' | 'USDC', amount: number) => {
    // 1. 토큰 승인
    await approveToken(tokenType, amount);
    // 2. 티켓 구매 (번호 자동 생성)
    await contract.buyTickets(tokenType === 'USDT' ? 0 : 1, amount);
};
```

---

## ⚠️ 주의사항

### 1. 컨트랙트 호환성
- V1과 V2 컨트랙트는 **호환되지 않습니다**
- 기존 V1 티켓은 V2에서 사용할 수 없습니다
- 새로운 V2 컨트랙트를 배포해야 합니다

### 2. 데이터 마이그레이션
- V1 티켓 데이터는 V2로 자동 마이그레이션되지 않습니다
- 필요시 수동으로 데이터를 백업하고 이전해야 합니다

### 3. 토큰 승인
- V2에서는 USDT/USDC 토큰 승인이 필요합니다
- 사용자가 최초 1회 토큰 승인을 해야 합니다

### 4. 환경 변수
- V2는 추가 환경 변수가 필요합니다 (USDT/USDC 주소)
- `.env.local` 파일을 반드시 업데이트해야 합니다

---

## 🐛 문제 해결

### 에러: "Element type is invalid"

**원인**: `providers.tsx`가 V1 훅을 import하고 있음

**해결**:
```bash
# providers.tsx 수정
nano frontend/src/app/providers.tsx

# 변경:
# import { LottoContractProvider } from '@/hooks/useLottoContract';
# →
# import { LottoV2ContractProvider } from '@/hooks/useLottoV2Contract';

# 그리고:
# <LottoContractProvider>
# →
# <LottoV2ContractProvider>
```

### 에러: "Cannot find module '@/hooks/useLottoV2Contract'"

**원인**: V2 훅 파일이 없음

**해결**:
```bash
# 브랜치가 올바른지 확인
git branch

# V2 브랜치로 전환
git checkout devin/1760968012-lotto-v2-usdt-usdc-auto-numbers-korean

# 최신 변경사항 가져오기
git pull
```

### 에러: "Contract not deployed"

**원인**: 환경 변수에 컨트랙트 주소가 없음

**해결**:
```bash
# 로컬: deploy-local.sh 실행
./deploy-local.sh

# 테스트넷: deploy-testnet.sh 실행
./deploy-testnet.sh

# .env.local 파일 확인
cat frontend/.env.local
```

### 빌드 에러: BigInt 관련

**원인**: TypeScript target이 ES2020 미만

**해결**: 이미 `tsconfig.json`에서 수정됨
```json
{
  "compilerOptions": {
    "target": "ES2020"
  }
}
```

---

## 📊 파일 변경 요약

### 수정해야 할 파일 (3개)
1. ✅ `frontend/src/app/providers.tsx` - V2 훅 import
2. ✅ `frontend/src/app/page.tsx` - V2 페이지로 교체
3. ✅ `frontend/src/app/admin/page.tsx` - V2 관리자 페이지로 교체

### 새로 생성된 파일 (V2)
- `contracts/src/LottoV2.sol`
- `contracts/src/mocks/MockERC20.sol`
- `contracts/test/LottoV2.t.sol`
- `contracts/script/DeployLottoV2.s.sol`
- `contracts/script/DeployMockTokens.s.sol`
- `frontend/src/hooks/useLottoV2Contract.tsx`
- `frontend/lib/abiV2.json`
- `frontend/src/app/pageV2.tsx`
- `frontend/src/app/providersV2.tsx`
- `frontend/src/app/admin/pageV2.tsx`

### 자동화 스크립트
- `setup-local.sh`
- `deploy-local.sh`
- `deploy-testnet.sh`
- `deploy-mock-tokens-testnet.sh`

### 문서
- `README.md`
- `QUICK_START.md`
- `SETUP_GUIDE.md`
- `SCRIPTS_README.md`
- `WORKFLOW.md`
- `DEPLOYMENT.md`
- `IMPLEMENTATION_SUMMARY.md`
- `MIGRATION_GUIDE.md` (이 파일)

---

## ✅ 마이그레이션 완료 확인

### 1. 빌드 성공
```bash
cd frontend
npm run build
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 브라우저 테스트
- http://localhost:3000 접속
- 지갑 연결
- USDT/USDC 선택
- 티켓 구매 테스트

### 4. 관리자 페이지 테스트
- http://localhost:3000/admin 접속
- 관리자 권한 확인
- 회차 관리 기능 테스트

---

## 🎯 다음 단계

마이그레이션 완료 후:

1. ✅ 로컬 테스트 완료
2. ✅ 테스트넷 배포
3. ✅ Chainlink VRF 설정
4. ✅ 전체 플로우 테스트
5. ✅ 프로덕션 배포 준비

---

## 📞 지원

문제가 발생하면:
1. 이 가이드의 문제 해결 섹션 확인
2. `SETUP_GUIDE.md` 참조
3. GitHub Issues에 문제 보고

---

**마이그레이션 성공을 기원합니다! 🎉**
