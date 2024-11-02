// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interfaces for ERC-721, ERC-1155, and ERC-20
interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address owner);
}

interface IERC1155 {
    function balanceOf(address account, uint256 id) external view returns (uint256);
}

interface IERC20 {
function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);}

contract NFTVerification {
    address public owner;
    address public paymentToken;
    address public paymentRecipient;
    address public administrator; // Administrator address
    uint256 public paymentAmount;

    struct NFTInfo {
        address nftAddress; // Address of the NFT contract
        uint256 tokenId;    // Token ID of the NFT (optional)
        bool isERC1155;     // True if NFT is ERC1155, false if ERC721
        address mapper;     // Address that added the NFT mapping
    }

    struct VerificationInfo {
        address walletAddress;
        string discordId;
    }

    struct RoleInfo {
        string roleName;
        uint256 requiredNFTCount;
        address registrant; // Address that registered the role
    }

    struct ValueRoleInfo {
        string roleName;
        uint256 requiredValue;
        address registrant; // Address that registered the value-based role
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

    mapping(address => NFTInfo) public nftMappings;
    mapping(address => VerificationInfo) public walletToDiscord;
    mapping(string => address) public discordToWallet;
    mapping(address => bool) public registeredClients; // Track registered clients
    mapping(address => RoleInfo[]) public nftRoles; // Track roles associated with each NFT
    mapping(address => mapping(uint256 => uint256)) public nftValueMappings; // NFT address -> tokenId -> value
    mapping(address => ValueRoleInfo[]) public nftValueRoles; // Track value-based roles associated with each NFT
    mapping(address => DiscountInfo) public discountMappings; // Address -> discount info

    address[] public nftAddresses;

    event NFTMapped(address indexed nftAddress, uint256 tokenId, bool isERC1155, address indexed mapper);
    event NFTUnmapped(address indexed nftAddress, address indexed remover);
    event VerificationRecorded(address indexed walletAddress, string discordId);
    event PaymentAmountChanged(uint256 newPaymentAmount);
    event RoleRegistered(address indexed nftAddress, string roleName, uint256 requiredNFTCount, address indexed client);
    event RoleUnregistered(address indexed nftAddress, string roleName, address indexed client);
    event ValueRoleRegistered(address indexed nftAddress, string roleName, uint256 requiredValue, address indexed client);
    event ValueRoleUnregistered(address indexed nftAddress, string roleName, address indexed client);
    event NFTValueMapped(address indexed nftAddress, uint256 tokenId, uint256 value);
    event DiscountSet(address indexed user, uint256 discountPercentage);

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
        require(nftMappings[nftAddress].nftAddress == address(0), "NFT already mapped");

        if (msg.sender != owner) {
            uint256 finalPaymentAmount = paymentAmount;
            if (discountMappings[msg.sender].isSet) {
                finalPaymentAmount = (paymentAmount * (100 - discountMappings[msg.sender].discountPercentage)) / 100;
            }
            IERC20(paymentToken).transferFrom(msg.sender, paymentRecipient, finalPaymentAmount);
        }

        nftMappings[nftAddress] = NFTInfo(nftAddress, tokenId, isERC1155, msg.sender);
        registeredClients[msg.sender] = true; // Mark the client as registered
        nftAddresses.push(nftAddress);
        emit NFTMapped(nftAddress, tokenId, isERC1155, msg.sender);
    }

    function removeNFT(address nftAddress) external {
        require(nftMappings[nftAddress].nftAddress != address(0), "NFT not mapped");
        require(nftMappings[nftAddress].mapper == msg.sender || msg.sender == owner, "Only the mapper or owner can remove");
        delete nftMappings[nftAddress];

        for (uint256 i = 0; i < nftAddresses.length; i++) {
            if (nftAddresses[i] == nftAddress) {
                nftAddresses[i] = nftAddresses[nftAddresses.length - 1];
                nftAddresses.pop();
                break;
            }
        }

        emit NFTUnmapped(nftAddress, msg.sender);
    }

    function verifyOwnership(address user, address nftAddress) external view returns (bool) {
        NFTInfo memory info = nftMappings[nftAddress];
        require(info.nftAddress != address(0), "NFT not mapped");

        if (info.isERC1155) {
            IERC1155 erc1155Token = IERC1155(info.nftAddress);
            if (info.tokenId == 0) {
                for (uint256 tokenId = 1; tokenId <= 10000; tokenId++) {
                    if (erc1155Token.balanceOf(user, tokenId) > 0) {
                        return true;
                    }
                }
                return false;
            } else {
                return erc1155Token.balanceOf(user, info.tokenId) > 0;
            }
        } else {
            IERC721 erc721Token = IERC721(info.nftAddress);
            if (info.tokenId == 0) {
                for (uint256 tokenId = 1; tokenId <= 10000; tokenId++) {
                    try erc721Token.ownerOf(tokenId) returns (address tokenOwner) {
                        if (tokenOwner == user) {
                            return true;
                        }
                    } catch {
                        continue;
                    }
                }
                return false;
            } else {
                return erc721Token.ownerOf(info.tokenId) == user;
            }
        }
    }

    function verifyOwnershipWithCount(address user, address nftAddress) external view returns (bool, uint256) {
        NFTInfo memory info = nftMappings[nftAddress];
        require(info.nftAddress != address(0), "NFT not mapped");

        if (info.isERC1155) {
            IERC1155 erc1155Token = IERC1155(info.nftAddress);
            uint256 balance = 0;
            if (info.tokenId == 0) {
                for (uint256 tokenId = 1; tokenId <= 10000; tokenId++) {
                    balance += erc1155Token.balanceOf(user, tokenId);
                }
            } else {
                balance = erc1155Token.balanceOf(user, info.tokenId);
            }
            return (balance > 0, balance);
        } else {
            IERC721 erc721Token = IERC721(info.nftAddress);
            uint256 balance = 0;
            if (info.tokenId == 0) {
                for (uint256 tokenId = 1; tokenId <= 10000; tokenId++) {
                    try erc721Token.ownerOf(tokenId) returns (address tokenOwner) {
                        if (tokenOwner == user) {
                            balance++;
                        }
                    } catch {
                        continue;
                    }
                }
            } else {
                balance = (erc721Token.ownerOf(info.tokenId) == user) ? 1 : 0;
            }
            return (balance > 0, balance);
        }
    }

    function checkUserNFTs(address user) external view returns (address[] memory, uint256[] memory) {
        uint256[] memory balances = new uint256[](nftAddresses.length);
        address[] memory ownedNFTs = new address[](nftAddresses.length);
        uint256 count = 0;

        for (uint256 i = 0; i < nftAddresses.length; i++) {
            NFTInfo memory info = nftMappings[nftAddresses[i]];

            if (info.isERC1155) {
                IERC1155 erc1155Token = IERC1155(info.nftAddress);
                uint256 balance = 0;
                if (info.tokenId == 0) {
                    for (uint256 tokenId = 1; tokenId <= 10000; tokenId++) {
                        balance += erc1155Token.balanceOf(user, tokenId);
                    }
                } else {
                    balance = erc1155Token.balanceOf(user, info.tokenId);
                }
                if (balance > 0) {
                    ownedNFTs[count] = info.nftAddress;
                    balances[count] = balance;
                    count++;
                }
            } else {
                IERC721 erc721Token = IERC721(info.nftAddress);
                uint256 balance = 0;
                if (info.tokenId == 0) {
                    for (uint256 tokenId = 1; tokenId <= 10000; tokenId++) {
                        try erc721Token.ownerOf(tokenId) returns (address tokenOwner) {
                            if (tokenOwner == user) {
                                balance++;
                            }
                        } catch {
                            continue;
                        }
                    }
                } else {
                    balance = (erc721Token.ownerOf(info.tokenId) == user) ? 1 : 0;
                }
                if (balance > 0) {
                    ownedNFTs[count] = info.nftAddress;
                    balances[count] = balance;
                    count++;
                }
            }
        }

        assembly {
            mstore(ownedNFTs, count)
            mstore(balances, count)
        }

        return (ownedNFTs, balances);
    }

    function recordVerification(address walletAddress, string memory discordId) external onlyAdministrator {
        require(walletToDiscord[walletAddress].walletAddress == address(0), "Wallet already associated");
        require(bytes(discordId).length > 0, "Invalid Discord ID");
        require(discordToWallet[discordId] == address(0), "Discord ID already associated");

        walletToDiscord[walletAddress] = VerificationInfo(walletAddress, discordId);
        discordToWallet[discordId] = walletAddress;

        emit VerificationRecorded(walletAddress, discordId);
    }

    function registerRole(address nftAddress, string memory roleName, uint256 requiredNFTCount) external {
        require(nftMappings[nftAddress].nftAddress != address(0), "NFT not mapped");
        require(registeredClients[msg.sender], "Only registered clients can register roles");

        RoleInfo memory newRole = RoleInfo(roleName, requiredNFTCount, msg.sender);
        nftRoles[nftAddress].push(newRole);

        emit RoleRegistered(nftAddress, roleName, requiredNFTCount, msg.sender);
    }

    function unregisterRole(address nftAddress, string memory roleName) external {
        require(nftMappings[nftAddress].nftAddress != address(0), "NFT not mapped");
        require(registeredClients[msg.sender], "Only registered clients can unregister roles");

        RoleInfo[] storage roles = nftRoles[nftAddress];
        for (uint256 i = 0; i < roles.length; i++) {
            if (keccak256(bytes(roles[i].roleName)) == keccak256(bytes(roleName)) && roles[i].registrant == msg.sender) {
                roles[i] = roles[roles.length - 1];
                roles.pop();
                emit RoleUnregistered(nftAddress, roleName, msg.sender);
                return;
            }
        }

        revert("Role not found or not registered by caller");
    }

    function registerValueRole(address nftAddress, string memory roleName, uint256 requiredValue) external {
        require(nftMappings[nftAddress].nftAddress != address(0), "NFT not mapped");
        require(registeredClients[msg.sender], "Only registered clients can register roles");

        ValueRoleInfo memory newValueRole = ValueRoleInfo(roleName, requiredValue, msg.sender);
        nftValueRoles[nftAddress].push(newValueRole);

        emit ValueRoleRegistered(nftAddress, roleName, requiredValue, msg.sender);
    }

    function unregisterValueRole(address nftAddress, string memory roleName) external {
        require(nftMappings[nftAddress].nftAddress != address(0), "NFT not mapped");
        require(registeredClients[msg.sender], "Only registered clients can unregister roles");

        ValueRoleInfo[] storage valueRoles = nftValueRoles[nftAddress];
        for (uint256 i = 0; i < valueRoles.length; i++) {
            if (keccak256(bytes(valueRoles[i].roleName)) == keccak256(bytes(roleName)) && valueRoles[i].registrant == msg.sender) {
                valueRoles[i] = valueRoles[valueRoles.length - 1];
                valueRoles.pop();
                emit ValueRoleUnregistered(nftAddress, roleName, msg.sender);
                return;
            }
        }

        revert("Value role not found or not registered by caller");
    }

    function mapNFTValue(address nftAddress, uint256 tokenId, uint256 value) external {
        require(nftMappings[nftAddress].nftAddress != address(0), "NFT not mapped");
        require(registeredClients[msg.sender], "Only registered clients can map NFT values");

        nftValueMappings[nftAddress][tokenId] = value;

        emit NFTValueMapped(nftAddress, tokenId, value);
    }

    function setAdministrator(address _administrator) external onlyOwner {
        administrator = _administrator;
    }

    function setDiscount(address user, uint256 discountPercentage) external onlyOwner {
        require(discountPercentage <= 100, "Invalid discount percentage");
        discountMappings[user] = DiscountInfo(discountPercentage, true);
        emit DiscountSet(user, discountPercentage);
    }

    function getVerification(address walletAddress) external view returns (VerificationInfo memory) {
        return walletToDiscord[walletAddress];
    }

    function getAllNFTMappings() external view returns (NFTInfo[] memory) {
        NFTInfo[] memory mappings = new NFTInfo[](nftAddresses.length);
        for (uint256 i = 0; i < nftAddresses.length; i++) {
            mappings[i] = nftMappings[nftAddresses[i]];
        }
        return mappings;
    }

    function getAllNFTRoles() public view returns (RoleInfo[] memory) {
        uint256 totalRoles = 0;
        for (uint256 i = 0; i < nftAddresses.length; i++) {
            totalRoles += nftRoles[nftAddresses[i]].length;
        }

        RoleInfo[] memory roles = new RoleInfo[](totalRoles);
        uint256 index = 0;
        for (uint256 i = 0; i < nftAddresses.length; i++) {
            RoleInfo[] memory nftRoleList = nftRoles[nftAddresses[i]];
            for (uint256 j = 0; j < nftRoleList.length; j++) {
                roles[index] = nftRoleList[j];
                index++;
            }
        }

        return roles;
    }

    function getAllNFTValueRoles() public view returns (ValueRoleInfo[] memory) {
        uint256 totalValueRoles = 0;
        for (uint256 i = 0; i < nftAddresses.length; i++) {
            totalValueRoles += nftValueRoles[nftAddresses[i]].length;
        }

        ValueRoleInfo[] memory valueRoles = new ValueRoleInfo[](totalValueRoles);
        uint256 index = 0;
        for (uint256 i = 0; i < nftAddresses.length; i++) {
            ValueRoleInfo[] memory nftValueRoleList = nftValueRoles[nftAddresses[i]];
            for (uint256 j = 0; j < nftValueRoleList.length; j++) {
                valueRoles[index] = nftValueRoleList[j];
                index++;
            }
        }

        return valueRoles;
    }

    function getRolesForNFT(address nftAddress) external view returns (RoleInfo[] memory) {
        return nftRoles[nftAddress];
    }

    function exportData() external view onlyOwner returns (bytes memory) {
        // Create arrays to hold the data
        NFTInfo[] memory nftInfoArray = new NFTInfo[](nftAddresses.length);
        RoleInfo[] memory roleInfoArray = getAllNFTRoles();
        ValueRoleInfo[] memory valueRoleInfoArray = getAllNFTValueRoles();

        // Populate the arrays with data
        for (uint256 i = 0; i < nftAddresses.length; i++) {
            nftInfoArray[i] = nftMappings[nftAddresses[i]];
        }

        // Create the export data struct
        ExportData memory data = ExportData(nftInfoArray, roleInfoArray, valueRoleInfoArray);

        // Encode the data as bytes and return it
        return abi.encode(data);
    }

    function changePaymentAmount(uint256 newPaymentAmount) external onlyOwner {
        paymentAmount = newPaymentAmount;
        emit PaymentAmountChanged(newPaymentAmount);
    }
}
