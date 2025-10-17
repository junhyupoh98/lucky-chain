// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IVRFConsumerRaw {
    function rawFulfillRandomWords(uint256 requestId, uint256[] calldata randomWords) external;
}

contract MockVRFCoordinatorV2 {
    uint256 private _nextRequestId = 1;

    struct Request {
        address consumer;
        bytes32 keyHash;
        uint64 subId;
        uint16 requestConfirmations;
        uint32 callbackGasLimit;
        uint32 numWords;
    }

    mapping(uint256 => Request) public requests;

    function requestRandomWords(
        bytes32 keyHash,
        uint64 subId,
        uint16 requestConfirmations,
        uint32 callbackGasLimit,
        uint32 numWords
    ) external returns (uint256 requestId) {
        requestId = _nextRequestId++;
        requests[requestId] = Request({
            consumer: msg.sender,
            keyHash: keyHash,
            subId: subId,
            requestConfirmations: requestConfirmations,
            callbackGasLimit: callbackGasLimit,
            numWords: numWords
        });
    }

    function fulfillRequest(uint256 requestId) external {
        Request memory r = requests[requestId];
        require(r.consumer != address(0), "MockVRF: invalid requestId");

        // 생성용 간단 난수들(테스트 목적)
        uint256[] memory words = new uint256[](r.numWords);
        for (uint256 i = 0; i < r.numWords; i++) {
            words[i] = uint256(keccak256(abi.encode(block.timestamp, requestId, i)));
        }

        IVRFConsumerRaw(r.consumer).rawFulfillRandomWords(requestId, words);
        delete requests[requestId];
    }
}


