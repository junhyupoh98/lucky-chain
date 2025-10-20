# 자동화 스크립트 가이드

이 문서는 Lucky Chain V2 프로젝트의 자동화 스크립트 사용법을 설명합니다.

## 📋 스크립트 목록

### 1. `setup-local.sh` - 로컬 환경 자동 설정

**목적**: 로컬 개발 환경을 처음부터 자동으로 설정합니다.

**수행 작업**:
- Foundry 설치 확인 및 자동 설치
- 컨트랙트 의존성 설치 (`forge install`)
- 컨트랙트 컴파일 (`forge build`)
- 컨트랙트 테스트 실행 (`forge test`)
- 프론트엔드 의존성 설치 (`npm install`)
- V2 페이지를 메인 페이지로 복사

**사용법**:
```bash
# 저장소 루트에서 실행
./setup-local.sh
```

**실행 시간**: 약 2-5분 (인터넷 속도에 따라 다름)

**출력 예시**:
```
🚀 Lucky Chain 로컬 환경 설정 시작...
📦 1단계: 컨트랙트 의존성 설치...
🔨 2단계: 컨트랙트 컴파일...
🧪 3단계: 테스트 실행...
✅ 컨트랙트 설정 완료!
📦 4단계: 프론트엔드 의존성 설치...
📝 5단계: V2 페이지를 메인 페이지로 설정...
✅ 프론트엔드 설정 완료!
🎉 로컬 환경 설정이 완료되었습니다!
```

---

### 2. `deploy-local.sh` - 로컬 Anvil 배포

**목적**: 로컬 Anvil 블록체인에 컨트랙트를 배포합니다.

**사전 요구사항**:
- `setup-local.sh` 실행 완료
- 터미널에서 `anvil` 실행 중

**수행 작업**:
- Mock USDT/USDC 토큰 배포
- LottoV2 컨트랙트 배포
- 프론트엔드 `.env.local` 파일 자동 생성
- 관리자 설정 파일 생성

**사용법**:
```bash
# 터미널 1: Anvil 실행
cd contracts
anvil

# 터미널 2: 배포 스크립트 실행
./deploy-local.sh
```

**실행 시간**: 약 30초

**출력 예시**:
```
🚀 로컬 Anvil에 배포 시작...
📝 1단계: Mock 토큰 배포...
✅ Mock USDT: 0x5FbDB2315678afecb367f032d93F642f64180aa3
✅ Mock USDC: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
📝 2단계: LottoV2 컨트랙트 배포...
✅ LottoV2: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
📝 3단계: 프론트엔드 환경 변수 설정...
✅ .env.local 파일 생성 완료!
🎉 로컬 배포가 완료되었습니다!
```

---

### 3. `deploy-testnet.sh` - 테스트넷 배포

**목적**: Kaia Kairos 테스트넷에 컨트랙트를 배포합니다.

**사전 요구사항**:
- `setup-local.sh` 실행 완료
- Kaia Kairos 테스트넷 KAIA 보유
- USDT/USDC 토큰 주소 (또는 `deploy-mock-tokens-testnet.sh` 실행)

**수행 작업**:
- `.env` 파일 검증 (없으면 템플릿 생성)
- 컨트랙트 컴파일 및 테스트
- Kaia Kairos 테스트넷에 LottoV2 배포
- 프론트엔드 `.env.local` 파일 자동 생성
- 프론트엔드 빌드

**사용법**:
```bash
# 1. .env 파일 편집 (처음 실행 시 자동 생성됨)
cd contracts
nano .env

# 필수 입력:
# - PRIVATE_KEY: 배포자 개인키
# - USDT_ADDRESS: USDT 컨트랙트 주소
# - USDC_ADDRESS: USDC 컨트랙트 주소
# - TREASURY_ADDRESS: 수수료 수령 주소

# 2. 배포 스크립트 실행
cd ..
./deploy-testnet.sh
```

**실행 시간**: 약 2-5분

**출력 예시**:
```
🚀 Kaia Kairos 테스트넷 배포 시작...
📝 배포 설정:
  RPC URL: https://public-en-kairos.node.kaia.io
  Chain ID: 1001
  USDT: 0x...
  USDC: 0x...
🔨 1단계: 컨트랙트 컴파일...
🧪 2단계: 테스트 실행...
🚀 3단계: LottoV2 배포...
⚠️  이 작업은 실제 트랜잭션을 전송합니다. 계속하시겠습니까? (y/n)
y
✅ LottoV2 배포 완료: 0x...
📝 4단계: 프론트엔드 환경 변수 설정...
✅ .env.local 파일 생성 완료!
🎉 테스트넷 배포가 완료되었습니다!
```

---

### 4. `deploy-mock-tokens-testnet.sh` - 테스트넷 Mock 토큰 배포

**목적**: Kaia Kairos 테스트넷에 Mock USDT/USDC를 배포합니다.

**사용 시나리오**:
- 테스트넷에 USDT/USDC가 없을 때
- 테스트용 토큰이 필요할 때

**수행 작업**:
- Mock USDT 배포 (6 decimals)
- Mock USDC 배포 (6 decimals)
- 배포자에게 1000 USDT/USDC 민팅

**사용법**:
```bash
# 1. .env 파일에 PRIVATE_KEY 설정
cd contracts
nano .env

# 2. Mock 토큰 배포
cd ..
./deploy-mock-tokens-testnet.sh

# 3. 출력된 주소를 .env 파일에 추가
cd contracts
nano .env
# USDT_ADDRESS=0x...
# USDC_ADDRESS=0x...

# 4. 이제 deploy-testnet.sh 실행 가능
```

**실행 시간**: 약 1-2분

**출력 예시**:
```
🪙 Kaia Kairos 테스트넷에 Mock 토큰 배포...
📝 배포 설정:
  RPC URL: https://public-en-kairos.node.kaia.io
  Chain ID: 1001
🚀 Mock USDT/USDC 배포...
⚠️  이 작업은 실제 트랜잭션을 전송합니다. 계속하시겠습니까? (y/n)
y
✅ Mock 토큰 배포 완료!
배포된 주소:
  Mock USDT: 0x...
  Mock USDC: 0x...
```

---

## 🔄 전체 워크플로우

### 로컬 개발 워크플로우

```bash
# 1. 환경 설정
./setup-local.sh

# 2. Anvil 시작 (터미널 1)
cd contracts && anvil

# 3. 로컬 배포 (터미널 2)
./deploy-local.sh

# 4. 프론트엔드 실행 (터미널 3)
cd frontend && npm run dev

# 5. 브라우저에서 http://localhost:3000 접속
```

### 테스트넷 배포 워크플로우

```bash
# 1. 환경 설정 (한 번만)
./setup-local.sh

# 2. Mock 토큰 배포 (USDT/USDC가 없는 경우)
./deploy-mock-tokens-testnet.sh

# 3. .env 파일 편집
cd contracts
nano .env
# PRIVATE_KEY, USDT_ADDRESS, USDC_ADDRESS, TREASURY_ADDRESS 입력

# 4. 테스트넷 배포
cd ..
./deploy-testnet.sh

# 5. Chainlink VRF 설정
# https://vrf.chain.link/ 방문하여 설정

# 6. 관리자 주소 설정
nano frontend/lib/adminConfig.ts

# 7. 프론트엔드 실행
cd frontend && npm run dev
```

---

## 🐛 문제 해결

### 스크립트 실행 권한 오류

```bash
# 에러: Permission denied
chmod +x setup-local.sh deploy-local.sh deploy-testnet.sh deploy-mock-tokens-testnet.sh
```

### Foundry 설치 실패

```bash
# 수동 설치
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc
foundryup
```

### Anvil 연결 실패

```bash
# Anvil이 실행 중인지 확인
ps aux | grep anvil

# Anvil 재시작
pkill anvil
cd contracts && anvil
```

### 배포 실패 - 가스 부족

```bash
# 지갑 잔액 확인
cast balance 0x당신의_주소 --rpc-url $RPC_URL

# 테스트넷 KAIA 받기
# https://faucet.kaia.io/
```

### .env 파일 로드 실패

```bash
# .env 파일 위치 확인
ls -la contracts/.env

# 파일 권한 확인
chmod 600 contracts/.env
```

---

## 📝 환경 변수 참조

### contracts/.env (테스트넷 배포용)

```bash
# 네트워크 설정
RPC_URL=https://public-en-kairos.node.kaia.io
CHAIN_ID=1001

# 배포자 개인키 (필수)
PRIVATE_KEY=0x...

# Chainlink VRF 설정
VRF_COORDINATOR_V2=0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B
VRF_SUBSCRIPTION_ID=11044659683291448636
VRF_KEY_HASH=0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae

# 토큰 주소 (필수)
USDT_ADDRESS=0x...
USDC_ADDRESS=0x...

# 수수료 설정 (필수)
TREASURY_ADDRESS=0x...
FEE_BPS=500

# 상금 분배 비율
W1=6000
W2=2500
W3=1500
```

### frontend/.env.local (자동 생성됨)

**로컬**:
```bash
NEXT_PUBLIC_LOTTO_ADDRESS=0x...
NEXT_PUBLIC_USDT_ADDRESS=0x...
NEXT_PUBLIC_USDC_ADDRESS=0x...
NEXT_PUBLIC_LOTTO_CHAIN_ID=31337
NEXT_PUBLIC_LOTTO_RPC_URL=http://localhost:8545
```

**테스트넷**:
```bash
NEXT_PUBLIC_LOTTO_ADDRESS=0x...
NEXT_PUBLIC_USDT_ADDRESS=0x...
NEXT_PUBLIC_USDC_ADDRESS=0x...
NEXT_PUBLIC_LOTTO_CHAIN_ID=1001
NEXT_PUBLIC_LOTTO_RPC_URL=https://public-en-kairos.node.kaia.io
```

---

## 🔒 보안 주의사항

### 개인키 관리

⚠️ **절대 하지 말 것**:
- 개인키를 git에 커밋
- 개인키를 스크린샷으로 공유
- 개인키를 메신저로 전송
- 테스트넷 개인키를 메인넷에 사용

✅ **해야 할 것**:
- `.env` 파일을 `.gitignore`에 추가 (이미 되어 있음)
- 개인키를 안전한 곳에 백업
- 테스트넷과 메인넷 개인키 분리
- 하드웨어 지갑 사용 (메인넷)

### 스크립트 실행 전 확인사항

1. **로컬 배포**:
   - Anvil이 실행 중인지 확인
   - 테스트 목적임을 인지

2. **테스트넷 배포**:
   - `.env` 파일의 모든 값 확인
   - 충분한 테스트넷 KAIA 보유
   - 배포 주소가 올바른지 확인

3. **메인넷 배포** (주의!):
   - 이 스크립트는 테스트넷용입니다
   - 메인넷 배포는 별도 검토 필요
   - 보안 감사 완료 후 진행

---

## 📊 스크립트 비교

| 스크립트 | 목적 | 실행 시간 | 비용 | 사전 요구사항 |
|---------|------|----------|------|--------------|
| `setup-local.sh` | 환경 설정 | 2-5분 | 무료 | 없음 |
| `deploy-local.sh` | 로컬 배포 | 30초 | 무료 | Anvil 실행 |
| `deploy-mock-tokens-testnet.sh` | Mock 토큰 배포 | 1-2분 | 가스비 | 테스트넷 KAIA |
| `deploy-testnet.sh` | 테스트넷 배포 | 2-5분 | 가스비 | 토큰 주소, KAIA |

---

## 🎯 다음 단계

스크립트 실행 후:

1. **로컬 개발**:
   - http://localhost:3000 접속
   - MetaMask 연결
   - 티켓 구매 테스트

2. **테스트넷 배포**:
   - Chainlink VRF 설정
   - 관리자 주소 설정
   - 전체 플로우 테스트

3. **프로덕션 준비**:
   - 보안 감사
   - 가스 최적화
   - 모니터링 설정

---

## 📞 지원

문제가 발생하면:
1. 이 문서의 문제 해결 섹션 확인
2. `SETUP_GUIDE.md` 참조
3. GitHub Issues에 문제 보고
