#!/bin/bash

set -e

echo "🚀 로컬 Anvil에 배포 시작..."

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
RPC_URL="http://localhost:8545"

cd contracts

echo -e "${BLUE}📝 1단계: Mock 토큰 배포...${NC}"
MOCK_OUTPUT=$(forge script script/DeployMockTokens.s.sol \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast \
    -vvv 2>&1)

echo "$MOCK_OUTPUT"

USDT_ADDRESS=$(echo "$MOCK_OUTPUT" | grep "Mock USDT deployed at:" | awk '{print $NF}')
USDC_ADDRESS=$(echo "$MOCK_OUTPUT" | grep "Mock USDC deployed at:" | awk '{print $NF}')

if [ -z "$USDT_ADDRESS" ] || [ -z "$USDC_ADDRESS" ]; then
    echo -e "${YELLOW}⚠️  토큰 주소를 자동으로 추출하지 못했습니다. 수동으로 확인해주세요.${NC}"
    echo "위 로그에서 Mock USDT와 USDC 주소를 찾아주세요."
    exit 1
fi

echo -e "${GREEN}✅ Mock USDT: $USDT_ADDRESS${NC}"
echo -e "${GREEN}✅ Mock USDC: $USDC_ADDRESS${NC}"

echo -e "${BLUE}📝 2단계: LottoV2 컨트랙트 배포...${NC}"

VRF_COORDINATOR="0x0000000000000000000000000000000000000001"
VRF_SUBSCRIPTION_ID="1"
VRF_KEY_HASH="0x0000000000000000000000000000000000000000000000000000000000000001"

LOTTO_OUTPUT=$(forge script script/DeployLottoV2.s.sol \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast \
    -vvv 2>&1)

echo "$LOTTO_OUTPUT"

LOTTO_ADDRESS=$(echo "$LOTTO_OUTPUT" | grep "LottoV2 deployed at:" | awk '{print $NF}')

if [ -z "$LOTTO_ADDRESS" ]; then
    echo -e "${YELLOW}⚠️  LottoV2 주소를 자동으로 추출하지 못했습니다.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ LottoV2: $LOTTO_ADDRESS${NC}"

cd ..

echo -e "${BLUE}📝 3단계: 프론트엔드 환경 변수 설정...${NC}"

cat > frontend/.env.local << EOF
NEXT_PUBLIC_LOTTO_ADDRESS=$LOTTO_ADDRESS
NEXT_PUBLIC_USDT_ADDRESS=$USDT_ADDRESS
NEXT_PUBLIC_USDC_ADDRESS=$USDC_ADDRESS
NEXT_PUBLIC_LOTTO_CHAIN_ID=31337
NEXT_PUBLIC_LOTTO_RPC_URL=http://localhost:8545
EOF

echo -e "${GREEN}✅ .env.local 파일 생성 완료!${NC}"

echo -e "${BLUE}📝 4단계: 관리자 설정 파일 생성...${NC}"

mkdir -p frontend/lib

cat > frontend/lib/adminConfig.ts << 'EOF'
export const allowedAdminAddresses = [
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
];
EOF

echo -e "${GREEN}✅ adminConfig.ts 파일 생성 완료!${NC}"

echo ""
echo -e "${GREEN}🎉 로컬 배포가 완료되었습니다!${NC}"
echo ""
echo -e "${YELLOW}배포된 주소:${NC}"
echo -e "  Mock USDT: ${BLUE}$USDT_ADDRESS${NC}"
echo -e "  Mock USDC: ${BLUE}$USDC_ADDRESS${NC}"
echo -e "  LottoV2:   ${BLUE}$LOTTO_ADDRESS${NC}"
echo ""
echo -e "${YELLOW}다음 단계:${NC}"
echo "1. 프론트엔드 실행:"
echo -e "   ${BLUE}cd frontend && npm run dev${NC}"
echo ""
echo "2. MetaMask 설정:"
echo "   - 네트워크: Localhost 8545"
echo "   - RPC URL: http://localhost:8545"
echo "   - 체인 ID: 31337"
echo "   - 개인키 가져오기: $PRIVATE_KEY"
echo ""
echo "3. http://localhost:3000 접속"
echo ""
