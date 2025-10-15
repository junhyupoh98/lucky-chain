// Mint.s.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/KiwoomFarm1155.sol";

// 민팅 스크립트도 똑같이 Script 컨트랙트를 상속받습니다.
contract MintKiwoomFarm is Script {
    
    function run() external {
        // --- 여기가 가장 중요합니다 ---
        // 1. 이전에 배포해서 얻은 컨트랙트 주소를 여기에 붙여넣습니다.
        address contractAddress = 0x000B33FbF9150cD1559a68AC26a207287cD708f3; // ⚠️ 본인의 컨트랙트 주소로 꼭 변경하세요!

        // 2. 해당 주소에 있는 KiwoomFarm1155 컨트랙트의 인스턴스를 가져옵니다.
        //    'new' 키워드가 없는 것에 주목하세요!
        KiwoomFarm1155 kiwoomFarm = KiwoomFarm1155(contractAddress);

        // 3. 민팅할 토큰의 정보 설정
        uint256 amountToMint = 1; // 새로 발행할 토큰의 개수
        string memory newTokenUri = "https://gateway.pinata.cloud/ipfs/bafkreidzyuwc3h4tc4keux546w7cojpun3rfogvgw7gp4pllvkmzdz5jpu"; // 토큰의 메타데이터 주소

        // --- 실제 트랜잭션 전송 ---
        // .env 파일에 있는 PRIVATE_KEY를 가진 지갑이 이 함수를 호출하게 됩니다.
        // 이 지갑이 컨트랙트의 owner여야 합니다. (onlyOwner 제어자 때문)
        vm.startBroadcast();

        // 가져온 컨트랙트 인스턴스의 createNewToken 함수를 호출합니다.
        kiwoomFarm.createNewToken(amountToMint, newTokenUri);

        vm.stopBroadcast();

        console.log("Minting Successful!");
        console.log("Minted %s tokens with URI: %s", amountToMint, newTokenUri);
    }
}