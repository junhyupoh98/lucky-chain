#!/bin/bash

set -e

echo "🚀 Lucky Chain 로컬 환경 설정 시작..."

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

if [ ! -d "contracts" ] || [ ! -d "frontend" ]; then
    echo "❌ 에러: lucky-chain 저장소 루트 디렉토리에서 실행해주세요"
    exit 1
fi

echo -e "${BLUE}📦 1단계: 컨트랙트 의존성 설치...${NC}"
cd contracts

if ! command -v forge &> /dev/null; then
    echo -e "${YELLOW}⚠️  Foundry가 설치되지 않았습니다. 설치를 시작합니다...${NC}"
    curl -L https://foundry.paradigm.xyz | bash
    source ~/.bashrc
    foundryup
fi

forge install --no-commit 2>/dev/null || true

echo -e "${BLUE}🔨 2단계: 컨트랙트 컴파일...${NC}"
forge build

echo -e "${BLUE}🧪 3단계: 테스트 실행...${NC}"
forge test

echo -e "${GREEN}✅ 컨트랙트 설정 완료!${NC}"

cd ..

echo -e "${BLUE}📦 4단계: 프론트엔드 의존성 설치...${NC}"
cd frontend

if [ ! -d "node_modules" ]; then
    npm install
else
    echo "node_modules가 이미 존재합니다. 스킵..."
fi

echo -e "${BLUE}📝 5단계: V2 페이지를 메인 페이지로 설정...${NC}"
cp src/app/pageV2.tsx src/app/page.tsx
cp src/app/providersV2.tsx src/app/providers.tsx
cp src/app/admin/pageV2.tsx src/app/admin/page.tsx

echo -e "${GREEN}✅ 프론트엔드 설정 완료!${NC}"

cd ..

echo ""
echo -e "${GREEN}🎉 로컬 환경 설정이 완료되었습니다!${NC}"
echo ""
echo -e "${YELLOW}다음 단계:${NC}"
echo "1. 터미널 1에서 Anvil 실행:"
echo -e "   ${BLUE}cd contracts && anvil${NC}"
echo ""
echo "2. 터미널 2에서 로컬 배포 스크립트 실행:"
echo -e "   ${BLUE}./deploy-local.sh${NC}"
echo ""
echo "3. 터미널 3에서 프론트엔드 실행:"
echo -e "   ${BLUE}cd frontend && npm run dev${NC}"
echo ""
