// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract VeriguardNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    
    string private _tokenURI;
    mapping(address => bool) private _hasMinted; // Tracks if an address has minted
    mapping(address => uint256) public _challenges; // Public mapping for challenges

    constructor(address initialOwner) 
        ERC721("VeriGuard", "VGD") 
        Ownable(initialOwner) 
    {
        _tokenURI = "ipfs://bafkreiciu46t7fhgdi2nks6ilchtapjd6nlbe5zxoeimfg32tq4bfjqoze";
        _tokenIdCounter.increment(); // Start from ID 1
    }

    // Generate a math challenge for the user
    function generateChallenge() public {
        require(!_hasMinted[msg.sender], "Address has already minted");
        require(_challenges[msg.sender] == 0, "Challenge already active");
        require(msg.sender.balance > 0, "Must have ETH balance"); // Proof of Interaction
        require(tx.origin == msg.sender, "No contracts allowed"); // Basic bot protection

        uint256 challenge = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, block.number))) % 100;
        _challenges[msg.sender] = challenge + 1; // Store with +1 to distinguish from 0
    }

    // Mint with challenge answer
    function mintWithChallenge(uint256 answer) public {
        require(msg.sender.balance > 0, "Must have ETH balance");
        require(tx.origin == msg.sender, "No contracts allowed");
        require(!_hasMinted[msg.sender], "Address has already minted");
        require(_challenges[msg.sender] > 0, "No active challenge");

        uint256 challenge = _challenges[msg.sender] - 1;
        require((challenge / 10) + (challenge % 10) == answer, "Incorrect answer"); // e.g., 42 -> 4 + 2 = 6
        delete _challenges[msg.sender]; // Wipe challenge on success

        _hasMinted[msg.sender] = true;
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
    }

    // Cancel the active challenge for the caller
    function cancelChallenge() public {
        require(_challenges[msg.sender] > 0, "No active challenge to cancel");
        delete _challenges[msg.sender]; // Wipe the challenge
    }

    // Burn function for token owners
    function burn(uint256 tokenId) public {
        require(_ownerOf(tokenId) == msg.sender, "Caller is not token owner");
        _burn(tokenId);
        _hasMinted[msg.sender] = false; // Allow reminting after burn (optional)
    }

    // Restrict transfers to only allow burning
    function _update(address to, uint256 tokenId, address auth)
        internal
        virtual
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (to != address(0)) {
            require(from == address(0), "Token is non-transferable");
        }
        return super._update(to, tokenId, auth);
    }

    // Returns the single URI for all tokens
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");
        return _tokenURI;
    }

    // Update token URI (owner only)
    function setTokenURI(string memory newTokenURI) public onlyOwner {
        require(bytes(newTokenURI).length > 0, "URI cannot be empty");
        _tokenURI = newTokenURI;
    }

    // Get current URI
    function getTokenURI() public view returns (string memory) {
        return _tokenURI;
    }

    // Get total supply
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current() - 1;
    }

    // Check if an address has minted
    function hasMinted(address user) public view returns (bool) {
        return _hasMinted[user];
    }
}	
