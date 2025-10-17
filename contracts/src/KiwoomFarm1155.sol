// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KiwoomFarm1155 is ERC1155, Ownable {
    uint256 public nextTokenId;

    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        uint256 amount;
    }
    mapping(uint256 => mapping(address => Listing)) public listings;

    // --- 두 번째 오류 해결: 개별 URI 관리를 위한 매핑 추가 ---
    mapping(uint256 => string) private _tokenURIs;

    event Listed(uint256 indexed tokenId, address indexed seller, uint256 amount, uint256 price);
    event Sold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 amount, uint256 price);
    event Unlisted(uint256 indexed tokenId, address indexed seller);
    event TokenCreated(uint256 indexed tokenId, address indexed creator, uint256 initialSupply, string uri);

    // --- 첫 번째 오류 해결: Ownable 생성자에 msg.sender 전달 ---
    constructor() ERC1155("") Ownable(msg.sender) {}

    // --- 두 번째 오류 해결: uri 함수를 오버라이드하여 개별 URI를 반환하도록 함 ---
    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    function createNewToken(uint256 initialSupply, string memory newUri) public onlyOwner {
        nextTokenId++;
        uint256 tokenId = nextTokenId;
        _mint(owner(), tokenId, initialSupply, "");
        // --- 두 번째 오류 해결: _setURI 대신 매핑에 직접 저장 ---
        _tokenURIs[tokenId] = newUri;
        emit TokenCreated(tokenId, owner(), initialSupply, newUri);
    }
    
    // (이하 listTokens, buyTokens, unlistTokens 함수는 이전과 동일)
    function listTokens(uint256 tokenId, uint256 amount, uint256 pricePerItem) public {
        require(balanceOf(msg.sender, tokenId) >= amount, "Not enough balance");
        require(pricePerItem > 0, "Price must be greater than zero");
        require(isApprovedForAll(msg.sender, address(this)), "Contract not approved to manage your tokens. Please approve first.");

        listings[tokenId][msg.sender] = Listing(tokenId, msg.sender, pricePerItem, amount);
        emit Listed(tokenId, msg.sender, amount, pricePerItem);
    }

    function buyTokens(uint256 tokenId, address seller) public payable {
        Listing storage listing = listings[tokenId][seller];
        require(listing.amount > 0, "Not listed for sale or no items available.");
        
        uint256 totalCost = listing.price * listing.amount;
        require(msg.value == totalCost, "Incorrect payment amount. Please send exact total price.");

        uint256 amountToBuy = listing.amount;
        
        delete listings[tokenId][seller];

        safeTransferFrom(seller, msg.sender, tokenId, amountToBuy, "");
        
        payable(seller).transfer(msg.value);

        emit Sold(tokenId, msg.sender, seller, amountToBuy, listing.price);
    }

    function unlistTokens(uint256 tokenId) public {
        require(listings[tokenId][msg.sender].amount > 0, "You have not listed this token for sale.");
        delete listings[tokenId][msg.sender];
        emit Unlisted(tokenId, msg.sender);
    }
    
    // (이하 onERC1155Received 등 나머지 코드는 삭제하거나 그대로 둬도 됨)
    // 이 함수들은 필수는 아니지만, 명시적으로 두는 것이 좋을 수 있습니다.
    function onERC1155Received(
        address, address, uint256, uint256, bytes calldata
    ) external pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address, address, uint256[] calldata, uint256[] calldata, bytes calldata
    ) external pure returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}