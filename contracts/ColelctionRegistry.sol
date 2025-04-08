// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

// Interface for contracts that have an owner() function
interface IOwnableNFT {
    function owner() external view returns (address);
}

/**
 * @title CollectionRegistry
 * @dev Registry for eligible NFT collections with associated RoyaltyDistributor addresses
 *      Verifies contract ownership before registration and management actions
 */
contract CollectionRegistry is Ownable, Pausable, ReentrancyGuard {
    // Mappings
    mapping(address => bool) public registeredCollections;
    mapping(address => address[]) public ownerCollections;
    mapping(address => address) public collectionToDistributor;
    mapping(address => address) public collectionToOwner;
    
    // Events
    event CollectionRegistered(address indexed contractAddress, address indexed owner, address indexed distributor);
    event CollectionRemoved(address indexed contractAddress, address indexed owner);
    event DistributorUpdated(address indexed contractAddress, address indexed oldDistributor, address indexed newDistributor);
    
    // Custom errors
    error InvalidAddress();
    error InvalidContract();
    error AlreadyRegistered();
    error NotRegistered();
    error NotCollectionOwner();
    error OwnershipVerificationFailed();

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Verify if the caller is the owner of the NFT contract
     */
    function verifyContractOwnership(address contractAddress) internal view returns (bool) {
        try IOwnableNFT(contractAddress).owner() returns (address contractOwner) {
            return contractOwner == msg.sender;
        } catch {
            // If the contract doesn't implement owner(), we can't verify ownership
            return false;
        }
    }

    /**
     * @dev Register a new NFT collection with its associated RoyaltyDistributor
     */
    function registerCollection(address contractAddress, address distributor) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        if (contractAddress == address(0) || distributor == address(0)) revert InvalidAddress();
        if (registeredCollections[contractAddress]) revert AlreadyRegistered();
        
        // Verify contract implements either ERC721 or ERC1155
        try IERC165(contractAddress).supportsInterface(type(IERC721).interfaceId) returns (bool isERC721) {
            try IERC165(contractAddress).supportsInterface(type(IERC1155).interfaceId) returns (bool isERC1155) {
                if (!isERC721 && !isERC1155) revert InvalidContract();
            } catch {
                if (!isERC721) revert InvalidContract();
            }
        } catch {
            revert InvalidContract();
        }

        // Verify that the caller is the owner of the NFT contract
        if (!verifyContractOwnership(contractAddress)) {
            revert NotCollectionOwner();
        }

        registeredCollections[contractAddress] = true;
        ownerCollections[msg.sender].push(contractAddress);
        collectionToDistributor[contractAddress] = distributor;
        collectionToOwner[contractAddress] = msg.sender;
        
        emit CollectionRegistered(contractAddress, msg.sender, distributor);
    }

    /**
     * @dev Remove a collection from the registry
     */
    function removeCollection(address contractAddress) 
        external 
        nonReentrant 
    {
        if (!registeredCollections[contractAddress]) revert NotRegistered();
        
        address collectionOwner = collectionToOwner[contractAddress];
        // Allow either the collection owner or registry owner, but verify NFT contract ownership
        if (msg.sender != collectionOwner && msg.sender != owner()) {
            revert NotCollectionOwner();
        }
        
        if (msg.sender == collectionOwner && !verifyContractOwnership(contractAddress)) {
            revert NotCollectionOwner();
        }

        // Remove from ownerCollections array
        if (msg.sender == collectionOwner) {
            address[] storage collections = ownerCollections[collectionOwner];
            for (uint i = 0; i < collections.length; i++) {
                if (collections[i] == contractAddress) {
                    collections[i] = collections[collections.length - 1];
                    collections.pop();
                    break;
                }
            }
        }
        
        registeredCollections[contractAddress] = false;
        delete collectionToDistributor[contractAddress];
        delete collectionToOwner[contractAddress];
        
        emit CollectionRemoved(contractAddress, collectionOwner);
    }

    /**
     * @dev Update the distributor address for an existing collection
     */
    function updateDistributor(address contractAddress, address newDistributor) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        if (!registeredCollections[contractAddress]) revert NotRegistered();
        if (newDistributor == address(0)) revert InvalidAddress();
        
        address collectionOwner = collectionToOwner[contractAddress];
        // Allow either the collection owner or registry owner, but verify NFT contract ownership
        if (msg.sender != collectionOwner && msg.sender != owner()) {
            revert NotCollectionOwner();
        }
        
        if (msg.sender == collectionOwner && !verifyContractOwnership(contractAddress)) {
            revert NotCollectionOwner();
        }
        
        address oldDistributor = collectionToDistributor[contractAddress];
        collectionToDistributor[contractAddress] = newDistributor;
        
        emit DistributorUpdated(contractAddress, oldDistributor, newDistributor);
    }

    // Existing view functions remain unchanged
    function isRegistered(address contractAddress) external view returns (bool) {
        return registeredCollections[contractAddress];
    }

    function getDistributor(address contractAddress) external view returns (address) {
        return collectionToDistributor[contractAddress];
    }

    function getCollectionOwner(address contractAddress) external view returns (address) {
        return collectionToOwner[contractAddress];
    }

    function getRegisteredCollections(address owner) external view returns (address[] memory) {
        return ownerCollections[owner];
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
