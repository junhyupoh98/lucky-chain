#!/bin/bash

set -e

echo "🚀 Kaia Kairos 테스트넷 배포 시작..."

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

if [ ! -d "contracts" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}❌ 에러: lucky-chain 저장소 루트 디렉토리에서 실행해주세요${NC}"
    exit 1
fi

cd contracts

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env 파일이 없습니다. 생성합니다...${NC}"
    
    cat > .env << 'EOF'
RPC_URL=https://public-en-kairos.node.kaia.io
CHAIN_ID=1001

PRIVATE_KEY=

VRF_COORDINATOR_V2=0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B
VRF_SUBSCRIPTION_ID=11044659683291448636
VRF_KEY_HASH=0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae

USDT_ADDRESS=
USDC_ADDRESS=

TREASURY_ADDRESS=
FEE_BPS=500

W1=6000
W2=2500
W3=1500
EOF

    echo -e "${RED}❌ .env 파일을 생성했습니다. 파일을 편집하여 필요한 값을 입력한 후 다시 실행해주세요.${NC}"
    echo -e "${YELLOW}필수 입력 항목:${NC}"
    echo "  - PRIVATE_KEY: 배포자 개인키"
    echo "  - USDT_ADDRESS: USDT 컨트랙트 주소"
    echo "  - USDC_ADDRESS: USDC 컨트랙트 주소"
    echo "  - TREASURY_ADDRESS: 수수료 수령 주소"
    exit 1
fi

source .env

if [ -z "$PRIVATE_KEY" ]; then
    echo -e "${RED}❌ PRIVATE_KEY가 설정되지 않았습니다.${NC}"
    exit 1
fi

if [ -z "$USDT_ADDRESS" ]; then
    echo -e "${RED}❌ USDT_ADDRESS가 설정되지 않았습니다.${NC}"
    exit 1
fi

if [ -z "$USDC_ADDRESS" ]; then
    echo -e "${RED}❌ USDC_ADDRESS가 설정되지 않았습니다.${NC}"
    exit 1
fi

if [ -z "$TREASURY_ADDRESS" ]; then
    echo -e "${RED}❌ TREASURY_ADDRESS가 설정되지 않았습니다.${NC}"
    exit 1
fi

echo -e "${BLUE}📝 배포 설정:${NC}"
echo "  RPC URL: $RPC_URL"
echo "  Chain ID: $CHAIN_ID"
echo "  USDT: $USDT_ADDRESS"
echo "  USDC: $USDC_ADDRESS"
echo "  Treasury: $TREASURY_ADDRESS"
echo ""

echo -e "${BLUE}🔨 1단계: 컨트랙트 컴파일...${NC}"
forge build

echo -e "${BLUE}🧪 2단계: 테스트 실행...${NC}"
forge test

echo -e "${BLUE}🚀 3단계: LottoV2 배포...${NC}"
echo -e "${YELLOW}⚠️  이 작업은 실제 트랜잭션을 전송합니다. 계속하시겠습니까? (y/n)${NC}"
read -r response

if [ "$response" != "y" ]; then
    echo "배포가 취소되었습니다."
    exit 0
fi

DEPLOY_OUTPUT=$(forge script script/DeployLottoV2.s.sol \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    -vvv 2>&1)

echo "$DEPLOY_OUTPUT"

LOTTO_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "LottoV2 deployed at:" | awk '{print $NF}')

if [ -z "$LOTTO_ADDRESS" ]; then
    echo -e "${YELLOW}⚠️  LottoV2 주소를 자동으로 추출하지 못했습니다.${NC}"
    echo "위 로그에서 배포된 컨트랙트 주소를 찾아 수동으로 입력해주세요:"
    read -r LOTTO_ADDRESS
fi

if [ -z "$LOTTO_ADDRESS" ]; then
    echo -e "${RED}❌ 컨트랙트 주소가 없습니다. 배포를 확인해주세요.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ LottoV2 배포 완료: $LOTTO_ADDRESS${NC}"

cd ..

echo -e "${BLUE}📝 4단계: 프론트엔드 환경 변수 설정...${NC}"

cat > frontend/.env.local << EOF
NEXT_PUBLIC_LOTTO_ADDRESS=$LOTTO_ADDRESS
NEXT_PUBLIC_USDT_ADDRESS=$USDT_ADDRESS
NEXT_PUBLIC_USDC_ADDRESS=$USDC_ADDRESS
NEXT_PUBLIC_LOTTO_CHAIN_ID=1001
NEXT_PUBLIC_LOTTO_RPC_URL=https://public-en-kairos.node.kaia.io
EOF

echo -e "${GREEN}✅ .env.local 파일 생성 완료!${NC}"

echo -e "${BLUE}📝 5단계: 관리자 설정 파일 확인...${NC}"

if [ ! -f "frontend/lib/adminConfig.ts" ]; then
    mkdir -p frontend/lib
    
    cat > frontend/lib/adminConfig.ts << 'EOF'
export const allowedAdminAddresses = [
    // 여기에 관리자 지갑 주소를 추가하세요
    // 예: '0x1234567890123456789012345678901234567890',
];
EOF
    
    echo -e "${YELLOW}⚠️  adminConfig.ts 파일을 생성했습니다. 관리자 주소를 추가해주세요.${NC}"
else
    echo -e "${GREEN}✅ adminConfig.ts 파일이 이미 존재합니다.${NC}"
fi

echo -e "${BLUE}📝 6단계: 프론트엔드 빌드...${NC}"
cd frontend

if [ ! -d "node_modules" ]; then
    npm install
fi

npm run build

echo ""
echo -e "${GREEN}🎉 테스트넷 배포가 완료되었습니다!${NC}"
echo ""
echo -e "${YELLOW}배포 정보:${NC}"
echo -e "  네트워크: ${BLUE}Kaia Kairos Testnet${NC}"
echo -e "  Chain ID: ${BLUE}1001${NC}"
echo -e "  LottoV2: ${BLUE}$LOTTO_ADDRESS${NC}"
echo -e "  USDT: ${BLUE}$USDT_ADDRESS${NC}"
echo -e "  USDC: ${BLUE}$USDC_ADDRESS${NC}"
echo ""
echo -e "${YELLOW}다음 단계:${NC}"
echo "1. Chainlink VRF 구독 설정:"
echo "   - https://vrf.chain.link/ 방문"
echo "   - 구독에 $LOTTO_ADDRESS 추가"
echo ""
echo "2. 관리자 주소 설정:"
echo "   - frontend/lib/adminConfig.ts 편집"
echo ""
echo "3. 프론트엔드 실행:"
echo -e "   ${BLUE}cd frontend && npm run dev${NC}"
echo ""
echo "4. 프로덕션 배포 (선택사항):"
echo -e "   ${BLUE}vercel --prod${NC}"
echo ""
echo -e "${YELLOW}컨트랙트 확인:${NC}"
echo "  https://kairos.kaiascope.com/account/$LOTTO_ADDRESS"
echo ""
