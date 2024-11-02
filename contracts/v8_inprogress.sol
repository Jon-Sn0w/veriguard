// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function balanceOf(address owner) external view returns (uint256 balance);
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

interface IERC1155 {
    function balanceOf(address account, uint256 id) external view returns (uint256);
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract NFTVerification {
    address public owner;
    address public paymentToken;
    address public paymentRecipient;
    address public administrator;
    uint256 public paymentAmount;

    struct NFTInfo {
        address nftAddress;
        uint256 tokenId;
        bool isERC1155;
        address mapper;
    }

    struct VerificationInfo {
        address walletAddress;
        string discordId;
    }

    struct RoleInfo {
        string roleName;
        uint256 requiredNFTCount;
        address registrant;
        uint256 tokenId;
    }

    struct ValueRoleInfo {
        string roleName;
        uint256 requiredValue;
        address registrant;
        uint256 tokenId;
    }

    struct DiscountInfo {
        uint256 discountPercentage;
        bool isSet;
    }

    struct ExportData {
        NFTInfo[] nftMappings;
        RoleInfo[] nftRoles;
        ValueRoleInfo[] nftValueRoles;
    }

    mapping(address => mapping(uint256 => NFTInfo)) public nftMappings;
    mapping(address => VerificationInfo) public walletToDiscord;
    mapping(string => address) public discordToWallet;
    mapping(address => bool) public registeredClients;
    mapping(address => mapping(uint256 => RoleInfo[])) public nftRoles;
    mapping(address => mapping(uint256 => uint256)) public nftValueMappings;
    mapping(address => mapping(uint256 => ValueRoleInfo[])) public nftValueRoles;
    mapping(address => DiscountInfo) public discountMappings;

    address[] public nftAddresses;
    mapping(address => uint256[]) public nftTokenIds;

    uint256 public constant MAX_PAGE_SIZE = 100;

    event NFTMapped(address indexed nftAddress, uint256 tokenId, bool isERC1155, address indexed mapper);
    event NFTUnmapped(address indexed nftAddress, uint256 tokenId, address indexed remover);
    event VerificationRecorded(address indexed walletAddress, string discordId);
    event PaymentAmountChanged(uint256 newPaymentAmount);
    event RoleRegistered(address indexed nftAddress, uint256 tokenId, string roleName, uint256 requiredNFTCount, address indexed client);
    event RoleUnregistered(address indexed nftAddress, uint256 tokenId, string roleName, address indexed client);
    event ValueRoleRegistered(address indexed nftAddress, uint256 tokenId, string roleName, uint256 requiredValue, address indexed client);
    event ValueRoleUnregistered(address indexed nftAddress, uint256 tokenId, string roleName, address indexed client);
    event NFTValueMapped(address indexed nftAddress, uint256 tokenId, uint256 value);
    event DiscountSet(address indexed user, uint256 discountPercentage);
    event AdministratorChanged(address indexed newAdministrator);
    event NFTTypeUpdated(address indexed nftAddress, uint256 tokenId, bool isERC1155);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyAdministrator() {
        require(msg.sender == administrator, "Only the administrator can perform this action");
        _;
    }

    constructor(address _paymentToken, uint256 _paymentAmount, address _paymentRecipient) {
        owner = msg.sender;
        paymentToken = _paymentToken;
        paymentAmount = _paymentAmount;
        paymentRecipient = _paymentRecipient;
    }

    function addNFT(address nftAddress, uint256 tokenId, bool isERC1155) external {
        require(nftMappings[nftAddress][tokenId].nftAddress == address(0), "NFT already mapped");
        require(nftAddress != address(0), "Invalid NFT address");

        // Validate the token type
        if (isERC1155) {
            require(IERC1155(nftAddress).supportsInterface(0xd9b67a26), "Address is not ERC1155");
        } else {
            require(IERC721(nftAddress).supportsInterface(0x80ac58cd), "Address is not ERC721");
        }

        if (msg.sender != owner) {
            uint256 finalPaymentAmount = paymentAmount;
            if (discountMappings[msg.sender].isSet) {
                finalPaymentAmount = (paymentAmount * (100 - discountMappings[msg.sender].discountPercentage)) / 100;
            }
            require(IERC20(paymentToken).transferFrom(msg.sender, paymentRecipient, finalPaymentAmount), "Payment failed");
        }

        nftMappings[nftAddress][tokenId] = NFTInfo(nftAddress, tokenId, isERC1155, msg.sender);
        registeredClients[msg.sender] = true;
        
        if (nftTokenIds[nftAddress].length == 0) {
            nftAddresses.push(nftAddress);
        }
        if (tokenId != 0) {
            nftTokenIds[nftAddress].push(tokenId);
        }

        emit NFTMapped(nftAddress, tokenId, isERC1155, msg.sender);
    }

    function updateNFTType(address nftAddress, uint256 tokenId, bool isERC1155) external {
        require(nftMappings[nftAddress][tokenId].nftAddress != address(0), "NFT not mapped");
        require(nftMappings[nftAddress][tokenId].mapper == msg.sender || msg.sender == owner, "Only the mapper or owner can update");
        
        nftMappings[nftAddress][tokenId].isERC1155 = isERC1155;
        emit NFTTypeUpdated(nftAddress, tokenId, isERC1155);
    }

    function removeNFT(address nftAddress, uint256 tokenId) external {
        require(nftMappings[nftAddress][tokenId].nftAddress != address(0), "NFT not mapped");
        require(nftMappings[nftAddress][tokenId].mapper == msg.sender || msg.sender == owner, "Only the mapper or owner can remove");

        delete nftMappings[nftAddress][tokenId];

        if (tokenId != 0) {
            uint256[] storage tokenIds = nftTokenIds[nftAddress];
            for (uint256 i = 0; i < tokenIds.length; i++) {
                if (tokenIds[i] == tokenId) {
                    tokenIds[i] = tokenIds[tokenIds.length - 1];
                    tokenIds.pop();
                    break;
                }
            }
        }

        if (nftTokenIds[nftAddress].length == 0) {
            for (uint256 i = 0; i < nftAddresses.length; i++) {
                if (nftAddresses[i] == nftAddress) {
                    nftAddresses[i] = nftAddresses[nftAddresses.length - 1];
                    nftAddresses.pop();
                    break;
                }
            }
        }

        emit NFTUnmapped(nftAddress, tokenId, msg.sender);
    }

    function verifyOwnership(address user, address nftAddress, uint256 tokenId) public view returns (bool) {
        NFTInfo memory nftInfo = nftMappings[nftAddress][tokenId];
        if (nftInfo.nftAddress == address(0)) return false;

        if (nftInfo.isERC1155) {
            if (tokenId == 0) {
                uint256[] memory tokenIds = nftTokenIds[nftAddress];
                for (uint256 i = 0; i < tokenIds.length; i++) {
                    if (IERC1155(nftAddress).balanceOf(user, tokenIds[i]) > 0) {
                        return true;
                    }
                }
                return false;
            } else {
                return IERC1155(nftAddress).balanceOf(user, tokenId) > 0;
            }
        } else {
            if (tokenId == 0) {
                return IERC721(nftAddress).balanceOf(user) > 0;
            } else {
                try IERC721(nftAddress).ownerOf(tokenId) returns (address tokenOwner) {
                    return tokenOwner == user;
                } catch {
                    return false;
                }
            }
        }
    }

    function verifyOwnershipWithCount(address user, address nftAddress, uint256 tokenId) public view returns (bool, uint256) {
        NFTInfo memory nftInfo = nftMappings[nftAddress][tokenId];
        if (nftInfo.nftAddress == address(0)) return (false, 0);

        if (nftInfo.isERC1155) {
            if (tokenId == 0) {
                uint256 totalBalance = 0;
                uint256[] memory tokenIds = nftTokenIds[nftAddress];
                for (uint256 i = 0; i < tokenIds.length; i++) {
                    totalBalance += IERC1155(nftAddress).balanceOf(user, tokenIds[i]);
                }
                return (totalBalance > 0, totalBalance);
            } else {
                uint256 balance = IERC1155(nftAddress).balanceOf(user, tokenId);
                return (balance > 0, balance);
            }
        } else {
            if (tokenId == 0) {
                uint256 balance = IERC721(nftAddress).balanceOf(user);
                return (balance > 0, balance);
            } else {
                try IERC721(nftAddress).ownerOf(tokenId) returns (address tokenOwner) {
                    return (tokenOwner == user, tokenOwner == user ? 1 : 0);
                } catch {
                    return (false, 0);
                }
            }
        }
    }

    function checkUserNFTs(address user) external view returns (address[] memory, uint256[] memory, uint256[] memory) {
        (uint256 totalCount, uint256[] memory counts) = countUserNFTs(user);
        return getUserNFTDetails(user, totalCount, counts);
    }

    function countUserNFTs(address user) internal view returns (uint256, uint256[] memory) {
        uint256 totalCount = 0;
        uint256[] memory counts = new uint256[](nftAddresses.length);

        for (uint256 i = 0; i < nftAddresses.length; i++) {
            address nftAddress = nftAddresses[i];
            (bool owned, uint256 balance) = verifyOwnershipWithCount(user, nftAddress, 0);
            if (owned) {
                counts[i] = balance;
                totalCount += balance;
            }
        }

        return (totalCount, counts);
    }

    function getUserNFTDetails(address user, uint256 totalCount, uint256[] memory counts) internal view returns (address[] memory, uint256[] memory, uint256[] memory) {
        address[] memory ownedNFTs = new address[](totalCount);
        uint256[] memory tokenIds = new uint256[](totalCount);
        uint256[] memory balances = new uint256[](totalCount);
        uint256 index = 0;

        for (uint256 i = 0; i < nftAddresses.length; i++) {
            if (counts[i] > 0) {
                (address[] memory nfts, uint256[] memory ids, uint256[] memory bals) = getUserNFTDetailsForAddress(user, nftAddresses[i], counts[i]);
                for (uint256 j = 0; j < nfts.length; j++) {
                    ownedNFTs[index] = nfts[j];
                    tokenIds[index] = ids[j];
                    balances[index] = bals[j];
                    index++;
                }
            }
        }

        return (ownedNFTs, tokenIds, balances);
    }

    function getUserNFTDetailsForAddress(address user, address nftAddress, uint256 count) internal view returns (address[] memory, uint256[] memory, uint256[] memory) {
        address[] memory nfts = new address[](count);
        uint256[] memory ids = new uint256[](count);
        uint256[] memory bals = new uint256[](count);
        uint256 index = 0;

        if (nftMappings[nftAddress][0].nftAddress != address(0)) {
            (bool owned, uint256 balance) = verifyOwnershipWithCount(user, nftAddress, 0);
            if (owned) {
                nfts[index] = nftAddress;
                ids[index] = 0;
                bals[index] = balance;
                index++;
            }
        } else {
            index = getSpecificTokenDetails(user, nftAddress, count, nfts, ids, bals);
        }

        return (nfts, ids, bals);
    }

    function getSpecificTokenDetails(
        address user,
        address nftAddress,
        uint256 count,
        address[] memory nfts,
        uint256[] memory ids,
        uint256[] memory bals
    ) internal view returns (uint256) {
        uint256 index = 0;
        uint256[] memory tokenIds = nftTokenIds[nftAddress];
        for (uint256 j = 0; j < tokenIds.length && index < count; j++) {
            uint256 tokenId = tokenIds[j];
            (bool owned, uint256 balance) = verifyOwnershipWithCount(user, nftAddress, tokenId);
            if (owned) {
                nfts[index] = nftAddress;
                ids[index] = tokenId;
                bals[index] = balance;
                index++;
            }
        }
        return index;
    }

    function recordVerification(address walletAddress, string memory discordId) external onlyAdministrator {
        require(walletToDiscord[walletAddress].walletAddress == address(0), "Wallet already associated");
        require(bytes(discordId).length > 0, "Invalid Discord ID");
        require(discordToWallet[discordId] == address(0), "Discord ID already associated");

        walletToDiscord[walletAddress] = VerificationInfo(walletAddress, discordId);
        discordToWallet[discordId] = walletAddress;

        emit VerificationRecorded(walletAddress, discordId);
    }

    function registerRole(address nftAddress, uint256 tokenId, string memory roleName, uint256 requiredNFTCount) external {
        require(nftMappings[nftAddress][tokenId].nftAddress != address(0), "NFT not mapped");
        require(registeredClients[msg.sender], "Only registered clients can register roles");

        RoleInfo memory newRole = RoleInfo(roleName, requiredNFTCount, msg.sender, tokenId);
        nftRoles[nftAddress][tokenId].push(newRole);

emit RoleRegistered(nftAddress, tokenId, roleName, requiredNFTCount, msg.sender);
    }

    function unregisterRole(address nftAddress, uint256 tokenId, string memory roleName) external {
        require(nftMappings[nftAddress][tokenId].nftAddress != address(0), "NFT not mapped");
        require(registeredClients[msg.sender], "Only registered clients can unregister roles");

        RoleInfo[] storage roles = nftRoles[nftAddress][tokenId];
        for (uint256 i = 0; i < roles.length; i++) {
            if (keccak256(bytes(roles[i].roleName)) == keccak256(bytes(roleName)) && roles[i].registrant == msg.sender) {
                roles[i] = roles[roles.length - 1];
                roles.pop();
                emit RoleUnregistered(nftAddress, tokenId, roleName, msg.sender);
                return;
            }
        }

        revert("Role not found or not registered by caller");
    }

    function registerValueRole(address nftAddress, uint256 tokenId, string memory roleName, uint256 requiredValue) external {
        require(nftMappings[nftAddress][tokenId].nftAddress != address(0), "NFT not mapped");
        require(registeredClients[msg.sender], "Only registered clients can register roles");

        ValueRoleInfo memory newValueRole = ValueRoleInfo(roleName, requiredValue, msg.sender, tokenId);
        nftValueRoles[nftAddress][tokenId].push(newValueRole);

        emit ValueRoleRegistered(nftAddress, tokenId, roleName, requiredValue, msg.sender);
    }

    function unregisterValueRole(address nftAddress, uint256 tokenId, string memory roleName) external {
        require(nftMappings[nftAddress][tokenId].nftAddress != address(0), "NFT not mapped");
        require(registeredClients[msg.sender], "Only registered clients can unregister roles");

        ValueRoleInfo[] storage valueRoles = nftValueRoles[nftAddress][tokenId];
        for (uint256 i = 0; i < valueRoles.length; i++) {
            if (keccak256(bytes(valueRoles[i].roleName)) == keccak256(bytes(roleName)) && valueRoles[i].registrant == msg.sender) {
                valueRoles[i] = valueRoles[valueRoles.length - 1];
                valueRoles.pop();
                emit ValueRoleUnregistered(nftAddress, tokenId, roleName, msg.sender);
                return;
            }
        }

        revert("Value role not found or not registered by caller");
    }

    function mapNFTValue(address nftAddress, uint256 tokenId, uint256 value) external {
        require(nftMappings[nftAddress][tokenId].nftAddress != address(0), "NFT not mapped");
        require(registeredClients[msg.sender], "Only registered clients can map NFT values");

        nftValueMappings[nftAddress][tokenId] = value;

        emit NFTValueMapped(nftAddress, tokenId, value);
    }

    function setAdministrator(address _administrator) external onlyOwner {
        require(_administrator != address(0), "Invalid administrator address");
        administrator = _administrator;
        emit AdministratorChanged(_administrator);
    }

    function setDiscount(address user, uint256 discountPercentage) external onlyOwner {
        require(discountPercentage <= 100, "Invalid discount percentage");
        discountMappings[user] = DiscountInfo(discountPercentage, true);
        emit DiscountSet(user, discountPercentage);
    }

    function getVerification(address walletAddress) external view returns (VerificationInfo memory) {
        return walletToDiscord[walletAddress];
    }

    function getAllNFTMappings(uint256 offset, uint256 limit) public view returns (NFTInfo[] memory) {
        require(limit <= MAX_PAGE_SIZE, "Limit exceeds maximum page size");
        
        uint256 totalCount = 0;
        for (uint256 i = 0; i < nftAddresses.length; i++) {
            totalCount += nftTokenIds[nftAddresses[i]].length;
        }
        
        uint256 end = offset + limit > totalCount ? totalCount : offset + limit;
        uint256 pageSize = end - offset;
        
        NFTInfo[] memory mappings = new NFTInfo[](pageSize);
        uint256 index = 0;
        uint256 count = 0;
        
        for (uint256 i = 0; i < nftAddresses.length && index < pageSize; i++) {
            address nftAddress = nftAddresses[i];
            uint256[] memory tokenIds = nftTokenIds[nftAddress];
            for (uint256 j = 0; j < tokenIds.length && index < pageSize; j++) {
                if (count >= offset) {
                    mappings[index] = nftMappings[nftAddress][tokenIds[j]];
                    index++;
                }
                count++;
            }
        }
        
        return mappings;
    }

    function getAllNFTRoles(uint256 offset, uint256 limit) public view returns (RoleInfo[] memory) {
        require(limit <= MAX_PAGE_SIZE, "Limit exceeds maximum page size");
        
        uint256 totalCount = 0;
        for (uint256 i = 0; i < nftAddresses.length; i++) {
            address nftAddress = nftAddresses[i];
            uint256[] memory tokenIds = nftTokenIds[nftAddress];
            for (uint256 j = 0; j < tokenIds.length; j++) {
                totalCount += nftRoles[nftAddress][tokenIds[j]].length;
            }
        }
        
        uint256 end = offset + limit > totalCount ? totalCount : offset + limit;
        uint256 pageSize = end - offset;
        
        RoleInfo[] memory roles = new RoleInfo[](pageSize);
        uint256 index = 0;
        uint256 count = 0;
        
        for (uint256 i = 0; i < nftAddresses.length && index < pageSize; i++) {
            address nftAddress = nftAddresses[i];
            uint256[] memory tokenIds = nftTokenIds[nftAddress];
            for (uint256 j = 0; j < tokenIds.length && index < pageSize; j++) {
                RoleInfo[] memory nftRoleList = nftRoles[nftAddress][tokenIds[j]];
                for (uint256 k = 0; k < nftRoleList.length && index < pageSize; k++) {
                    if (count >= offset) {
                        roles[index] = nftRoleList[k];
                        index++;
                    }
                    count++;
                }
            }
        }
        
        return roles;
    }

    function getAllNFTValueRoles(uint256 offset, uint256 limit) public view returns (ValueRoleInfo[] memory) {
        require(limit <= MAX_PAGE_SIZE, "Limit exceeds maximum page size");
        
        uint256 totalCount = 0;
        for (uint256 i = 0; i < nftAddresses.length; i++) {
            address nftAddress = nftAddresses[i];
            uint256[] memory tokenIds = nftTokenIds[nftAddress];
            for (uint256 j = 0; j < tokenIds.length; j++) {
                totalCount += nftValueRoles[nftAddress][tokenIds[j]].length;
            }
        }
        
        uint256 end = offset + limit > totalCount ? totalCount : offset + limit;
        uint256 pageSize = end - offset;
        
        ValueRoleInfo[] memory valueRoles = new ValueRoleInfo[](pageSize);
        uint256 index = 0;
        uint256 count = 0;
        
        for (uint256 i = 0; i < nftAddresses.length && index < pageSize; i++) {
            address nftAddress = nftAddresses[i];
            uint256[] memory tokenIds = nftTokenIds[nftAddress];
            for (uint256 j = 0; j < tokenIds.length && index < pageSize; j++) {
                ValueRoleInfo[] memory nftValueRoleList = nftValueRoles[nftAddress][tokenIds[j]];
                for (uint256 k = 0; k < nftValueRoleList.length && index < pageSize; k++) {
                    if (count >= offset) {
                        valueRoles[index] = nftValueRoleList[k];
                        index++;
                    }
                    count++;
                }
            }
        }
        
        return valueRoles;
    }

    function getRolesForNFT(address nftAddress, uint256 tokenId) external view returns (RoleInfo[] memory) {
        return nftRoles[nftAddress][tokenId];
    }

    function exportData(uint256 offset, uint256 limit) external view returns (bytes memory) {
        NFTInfo[] memory nftInfoArray = getAllNFTMappings(offset, limit);
        RoleInfo[] memory roleInfoArray = getAllNFTRoles(offset, limit);
        ValueRoleInfo[] memory valueRoleInfoArray = getAllNFTValueRoles(offset, limit);

        ExportData memory data = ExportData(nftInfoArray, roleInfoArray, valueRoleInfoArray);

        return abi.encode(data);
    }

    function changePaymentAmount(uint256 newPaymentAmount) external onlyOwner {
        paymentAmount = newPaymentAmount;
        emit PaymentAmountChanged(newPaymentAmount);
    }
}        
