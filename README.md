# Lucky Chain V2 🎰

블록체인 기반 복권 시스템 - USDT/USDC로 $1 티켓 구매, 자동 번호 생성, 완전한 한국어 지원

## 🚀 빠른 시작

### 로컬 개발 (3단계)

```bash
# 1. 환경 설정
./setup-local.sh

# 2. Anvil 시작 (터미널 1)
cd contracts && anvil

# 3. 로컬 배포 (터미널 2)
./deploy-local.sh

# 4. 프론트엔드 실행 (터미널 3)
cd frontend && npm run dev
```

### 테스트넷 배포

```bash
# 1. 환경 설정
./setup-local.sh

# 2. Mock 토큰 배포 (선택사항)
./deploy-mock-tokens-testnet.sh

# 3. .env 파일 편집
cd contracts && nano .env

# 4. 테스트넷 배포
cd .. && ./deploy-testnet.sh
```

## 📚 문서

- **[완전 설정 가이드](SETUP_GUIDE.md)** - 처음부터 끝까지 상세한 설정 방법
- **[스크립트 가이드](SCRIPTS_README.md)** - 자동화 스크립트 사용법
- **[배포 가이드](DEPLOYMENT.md)** - 배포 상세 정보
- **[구현 요약](IMPLEMENTATION_SUMMARY.md)** - 기술적 구현 내용

## ✨ 주요 기능

### 스마트 컨트랙트 (LottoV2)
- ✅ **USDT/USDC 결제** - $1 고정 가격 티켓
- ✅ **자동 번호 생성** - 온체인에서 6개 번호 + 럭키 번호 자동 생성
- ✅ **자동 라운드 진행** - 시간 기반 자동 진행
- ✅ **Chainlink VRF** - 검증 가능한 랜덤 당첨 번호
- ✅ **토큰별 상금 풀** - USDT/USDC 분리 관리

### 프론트엔드
- ✅ **완전한 한국어** - 네이티브 수준 현지화
- ✅ **반응형 디자인** - 모바일 우선 설계
- ✅ **사용자 대시보드** - 구매 내역 및 당첨 확인
- ✅ **관리자 페이지** - 회차/사용자/티켓/매출 관리

## 🏗️ 프로젝트 구조

```
lucky-chain/
├── setup-local.sh              # 로컬 환경 자동 설정
├── deploy-local.sh             # 로컬 배포 스크립트
├── deploy-testnet.sh           # 테스트넷 배포 스크립트
├── deploy-mock-tokens-testnet.sh  # Mock 토큰 배포
├── contracts/
│   ├── src/
│   │   ├── LottoV2.sol        # 메인 컨트랙트
│   │   └── mocks/
│   │       └── MockERC20.sol  # 테스트용 토큰
│   ├── script/
│   │   ├── DeployLottoV2.s.sol
│   │   └── DeployMockTokens.s.sol
│   └── test/
│       └── LottoV2.t.sol      # 테스트 (7개 통과)
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx       # 메인 페이지
    │   │   └── admin/
    │   │       └── page.tsx   # 관리자 페이지
    │   └── hooks/
    │       └── useLottoV2Contract.tsx
    └── lib/
        └── adminConfig.ts     # 관리자 주소 설정
```

## 🛠️ 기술 스택

- **Smart Contracts**: Solidity ^0.8.24, Foundry
- **Frontend**: Next.js 15.5.5, React 19, TypeScript
- **Blockchain**: Kaia (Klaytn), Ethereum-compatible
- **Oracles**: Chainlink VRF V2
- **Tokens**: ERC20 (USDT/USDC)
- **Styling**: Tailwind CSS

## 📋 사전 요구사항

- Node.js 18.x 이상
- Git
- Foundry (자동 설치됨)

## 🧪 테스트

```bash
cd contracts

# 모든 테스트 실행
forge test

# 상세 로그
forge test -vvv

# 특정 테스트
forge test --match-test testBuyTicket -vvv

# 가스 리포트
forge test --gas-report
```

**테스트 결과**: 7개 테스트 모두 통과 ✅

## 🔧 개발 명령어

### 컨트랙트

```bash
cd contracts

# 컴파일
forge build

# 테스트
forge test

# 로컬 배포
forge script script/DeployLottoV2.s.sol --rpc-url http://localhost:8545 --broadcast

# 포맷팅
forge fmt
```

### 프론트엔드

```bash
cd frontend

# 개발 서버
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start

# 린트
npm run lint
```

## 🌐 네트워크 정보

### Kaia Kairos Testnet

- **RPC URL**: https://public-en-kairos.node.kaia.io
- **Chain ID**: 1001
- **Explorer**: https://kairos.kaiascope.com
- **Faucet**: https://faucet.kaia.io/

### 로컬 Anvil

- **RPC URL**: http://localhost:8545
- **Chain ID**: 31337
- **계정**: 10개 (각 10,000 ETH)

## 🔐 보안

⚠️ **중요**:
- 개인키를 절대 코드에 하드코딩하지 마세요
- `.env` 파일을 git에 커밋하지 마세요
- 테스트넷과 메인넷 개인키를 분리하세요
- 메인넷 배포 전 보안 감사를 받으세요

## 📞 지원

- **문서**: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **스크립트**: [SCRIPTS_README.md](SCRIPTS_README.md)
- **Issues**: GitHub Issues

## 📄 라이선스

MIT License

## 🎯 다음 단계

1. ✅ 로컬 환경 설정 완료
2. ✅ 로컬 테스트 완료
3. ⏳ 테스트넷 배포
4. ⏳ Chainlink VRF 설정
5. ⏳ 프로덕션 배포

---

**Made with ❤️ for Lucky Chain**
