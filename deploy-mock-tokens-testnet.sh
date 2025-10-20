#!/bin/bash

set -e

echo "🪙 Kaia Kairos 테스트넷에 Mock 토큰 배포..."

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

cd contracts

if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env 파일이 없습니다. deploy-testnet.sh를 먼저 실행하거나 .env 파일을 생성해주세요.${NC}"
    exit 1
fi

source .env

if [ -z "$PRIVATE_KEY" ]; then
    echo -e "${RED}❌ PRIVATE_KEY가 설정되지 않았습니다.${NC}"
    exit 1
fi

if [ -z "$RPC_URL" ]; then
    RPC_URL="https://public-en-kairos.node.kaia.io"
fi

echo -e "${BLUE}📝 배포 설정:${NC}"
echo "  RPC URL: $RPC_URL"
echo "  Chain ID: 1001"
echo ""

echo -e "${BLUE}🚀 Mock USDT/USDC 배포...${NC}"
echo -e "${YELLOW}⚠️  이 작업은 실제 트랜잭션을 전송합니다. 계속하시겠습니까? (y/n)${NC}"
read -r response

if [ "$response" != "y" ]; then
    echo "배포가 취소되었습니다."
    exit 0
fi

MOCK_OUTPUT=$(forge script script/DeployMockTokens.s.sol \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    -vvv 2>&1)

echo "$MOCK_OUTPUT"

USDT_ADDRESS=$(echo "$MOCK_OUTPUT" | grep "Mock USDT deployed at:" | awk '{print $NF}')
USDC_ADDRESS=$(echo "$MOCK_OUTPUT" | grep "Mock USDC deployed at:" | awk '{print $NF}')

if [ -z "$USDT_ADDRESS" ] || [ -z "$USDC_ADDRESS" ]; then
    echo -e "${YELLOW}⚠️  토큰 주소를 자동으로 추출하지 못했습니다.${NC}"
    echo "위 로그에서 Mock USDT와 USDC 주소를 찾아 수동으로 입력해주세요."
    echo ""
    echo "Mock USDT 주소:"
    read -r USDT_ADDRESS
    echo "Mock USDC 주소:"
    read -r USDC_ADDRESS
fi

if [ -z "$USDT_ADDRESS" ] || [ -z "$USDC_ADDRESS" ]; then
    echo -e "${RED}❌ 토큰 주소가 없습니다. 배포를 확인해주세요.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Mock 토큰 배포 완료!${NC}"
echo ""
echo -e "${YELLOW}배포된 주소:${NC}"
echo -e "  Mock USDT: ${BLUE}$USDT_ADDRESS${NC}"
echo -e "  Mock USDC: ${BLUE}$USDC_ADDRESS${NC}"
echo ""
echo -e "${YELLOW}다음 단계:${NC}"
echo "1. .env 파일에 토큰 주소 추가:"
echo -e "   ${BLUE}USDT_ADDRESS=$USDT_ADDRESS${NC}"
echo -e "   ${BLUE}USDC_ADDRESS=$USDC_ADDRESS${NC}"
echo ""
echo "2. deploy-testnet.sh 스크립트 실행"
echo ""
echo -e "${YELLOW}컨트랙트 확인:${NC}"
echo "  USDT: https://kairos.kaiascope.com/account/$USDT_ADDRESS"
echo "  USDC: https://kairos.kaiascope.com/account/$USDC_ADDRESS"
echo ""
