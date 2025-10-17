// Mint.s.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/StdJson.sol";
import "../src/KiwoomFarm1155.sol";

// 민팅 스크립트도 똑같이 Script 컨트랙트를 상속받습니다.
contract MintKiwoomFarm is Script {
    using stdJson for string;

    address constant DEFAULT_CONTRACT_ADDRESS = 0x000B33FbF9150cD1559a68AC26a207287cD708f3;

    function run() external {
        // --- 여기가 가장 중요합니다 ---
        // 1. 이전에 배포해서 얻은 컨트랙트 주소를 환경변수로 받아옵니다. 없으면 예시 주소를 사용합니다.
        address contractAddress = DEFAULT_CONTRACT_ADDRESS;
        try vm.envAddress("KIWOOM_FARM_ADDRESS") returns (address value) {
            contractAddress = value;
        } catch {}

        // 2. 해당 주소에 있는 KiwoomFarm1155 컨트랙트의 인스턴스를 가져옵니다.
        //    'new' 키워드가 없는 것에 주목하세요!
        KiwoomFarm1155 kiwoomFarm = KiwoomFarm1155(contractAddress);

        // 3. 민팅할 토큰의 정보 설정
        uint256 amountToMint = 1; // 새로 발행할 토큰의 개수
        try vm.envUint("TICKET_SUPPLY") returns (uint256 supply) {
            amountToMint = supply;
        } catch {}

        // Pinata API 를 통해 고유한 메타데이터 CID를 요청합니다.
        string memory metadataEndpoint = "http://localhost:3000/api/pinata";
        try vm.envString("PINATA_METADATA_ENDPOINT") returns (string memory endpoint) {
            metadataEndpoint = endpoint;
        } catch {}
        string memory ticketPayload = vm.envString("TICKET_METADATA_PAYLOAD");
        require(bytes(ticketPayload).length > 0, "TICKET_METADATA_PAYLOAD env var is required");

        string memory cid = requestCid(metadataEndpoint, ticketPayload);

        // --- 실제 트랜잭션 전송 ---
        // .env 파일에 있는 PRIVATE_KEY를 가진 지갑이 이 함수를 호출하게 됩니다.
        // 이 지갑이 컨트랙트의 owner여야 합니다. (onlyOwner 제어자 때문)
        vm.startBroadcast();

        // 가져온 컨트랙트 인스턴스의 createNewToken 함수를 호출합니다.
        kiwoomFarm.createNewToken(amountToMint, cid);

        vm.stopBroadcast();

        console.log("Minting Successful!");
        console.log("Minted %s tokens with CID: %s", amountToMint, cid);
    }

    function requestCid(string memory endpoint, string memory payload) internal returns (string memory) {
        string[] memory cmd = new string[](10);
        cmd[0] = "curl";
        cmd[1] = "-s";
        cmd[2] = "-f";
        cmd[3] = "-X";
        cmd[4] = "POST";
        cmd[5] = endpoint;
        cmd[6] = "-H";
        cmd[7] = "Content-Type: application/json";
        cmd[8] = "-d";
        cmd[9] = payload;

        bytes memory response = vm.ffi(cmd);
        require(response.length > 0, "Pinata API response was empty");

        string memory jsonResponse = string(response);
        bytes memory cidRaw = vm.parseJson(jsonResponse, ".cid");
        string memory cid = abi.decode(cidRaw, (string));
        require(bytes(cid).length > 0, "Pinata API did not return a CID");
        return cid;
    }
}