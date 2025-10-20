# Lucky Chain V2 배포 가이드

## 개요

Lucky Chain V2는 USDT/USDC 스테이블코인으로 $1 고정 가격 티켓을 구매할 수 있는 블록체인 복권 시스템입니다.

## 주요 변경사항

### 스마트 컨트랙트 (LottoV2)
- ✅ USDT/USDC 결제 지원 (기존 네이티브 토큰 대신)
- ✅ $1 고정 티켓 가격
- ✅ 자동 번호 생성 (온체인)
- ✅ 자동 라운드 진행 기능
- ✅ 토큰별 상금 풀 분리 관리

### 프론트엔드
- ✅ 완전한 한국어 현지화
- ✅ 모바일 우선 반응형 디자인
- ✅ 수동 번호 입력 제거 (자동 생성만)
- ✅ 사용자 상태 및 구매 내역 섹션
- ✅ 관리자 대시보드 (/admin)

## 배포 단계

### 1. 스마트 컨트랙트 배포

#### 환경 변수 설정

`.env` 파일을 `contracts/` 디렉토리에 생성:

```bash
# 네트워크 설정
RPC_URL=https://public-en-kairos.node.kaia.io
CHAIN_ID=1001

# 배포자 개인키
PRIVATE_KEY=your_private_key_here

# Chainlink VRF 설정
VRF_COORDINATOR_V2=0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B
VRF_SUBSCRIPTION_ID=11044659683291448636
VRF_KEY_HASH=0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae

# 토큰 주소 (Kaia Kairos Testnet)
USDT_ADDRESS=0x...  # USDT 컨트랙트 주소
USDC_ADDRESS=0x...  # USDC 컨트랙트 주소

# 수수료 설정
TREASURY_ADDRESS=0x...  # 수수료 수령 주소
FEE_BPS=500  # 5% (basis points)

# 상금 분배 비율 (총 10000 = 100%)
W1=6000  # 1등 60%
W2=2500  # 2등 25%
W3=1500  # 3등 15%
```

#### 컨트랙트 배포 실행

```bash
cd contracts

# 컴파일
forge build

# 테스트
forge test

# 배포
forge script script/DeployLottoV2.s.sol \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

배포 후 컨트랙트 주소를 기록해두세요.

### 2. 프론트엔드 배포

#### 환경 변수 설정

`.env.local` 파일을 `frontend/` 디렉토리에 생성:

```bash
# 컨트랙트 설정
NEXT_PUBLIC_LOTTO_ADDRESS=0x...  # 배포된 LottoV2 주소
NEXT_PUBLIC_LOTTO_CHAIN_ID=1001
NEXT_PUBLIC_LOTTO_RPC_URL=https://public-en-kairos.node.kaia.io
```

#### 빌드 및 배포

```bash
cd frontend

# 의존성 설치
npm install

# 빌드
npm run build

# 로컬 테스트
npm run dev

# 프로덕션 배포 (Vercel 예시)
vercel --prod
```

### 3. 초기 설정

#### Chainlink VRF 구독 설정

1. [Chainlink VRF](https://vrf.chain.link/) 방문
2. 구독 생성 및 LINK 토큰 충전
3. LottoV2 컨트랙트를 컨슈머로 추가

#### 관리자 주소 설정

`frontend/lib/adminConfig.ts` 파일 수정:

```typescript
export const allowedAdminAddresses = [
    '0x...', // 관리자 주소 1
    '0x...', // 관리자 주소 2
];
```

## 사용 방법

### 사용자

1. 지갑 연결 (MetaMask 등)
2. USDT 또는 USDC 선택
3. 구매할 티켓 수량 선택
4. 토큰 승인 (최초 1회)
5. 티켓 구매
6. 당첨 시 상금 수령

### 관리자

1. `/admin` 페이지 접속
2. 회차 관리:
   - 자동 진행: 시간이 지나면 자동으로 다음 단계로
   - 수동 종료: 판매 기간 종료
   - 당첨 번호 추첨: Chainlink VRF 요청
   - 당첨금 정산: 상금 계산 및 분배
   - 다음 회차 시작: 새 라운드 시작

## 테스트

### 로컬 테스트 (Anvil)

```bash
# 터미널 1: Anvil 실행
anvil

# 터미널 2: 테스트 토큰 배포
cd contracts
forge script script/DeployMockTokens.s.sol --rpc-url http://localhost:8545 --broadcast

# 터미널 3: LottoV2 배포
forge script script/DeployLottoV2.s.sol --rpc-url http://localhost:8545 --broadcast

# 프론트엔드 실행
cd ../frontend
npm run dev
```

## 문제 해결

### 컨트랙트 배포 실패

- 가스 부족: 지갑에 충분한 KAIA가 있는지 확인
- VRF 설정 오류: Chainlink VRF 파라미터 확인
- 토큰 주소 오류: USDT/USDC 주소가 올바른지 확인

### 프론트엔드 연결 실패

- 네트워크 불일치: 지갑이 올바른 네트워크에 연결되어 있는지 확인
- 컨트랙트 주소 오류: 환경 변수의 주소가 올바른지 확인
- RPC 오류: RPC URL이 작동하는지 확인

### 토큰 승인 실패

- 잔액 부족: 충분한 USDT/USDC가 있는지 확인
- 가스 부족: 충분한 KAIA가 있는지 확인

## 보안 고려사항

1. **개인키 관리**: 절대 개인키를 코드에 하드코딩하지 마세요
2. **환경 변수**: `.env` 파일을 git에 커밋하지 마세요
3. **관리자 권한**: 관리자 주소를 신중하게 설정하세요
4. **감사**: 메인넷 배포 전 보안 감사를 받으세요

## 라이선스

MIT License
