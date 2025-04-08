// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/utils/Multicall.sol";

interface IWNat {
    function deposit() external payable;
    function withdraw(uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
    function delegate(address to, uint256 bips) external;
    function undelegateAll() external;
}

interface IFtsoRewardManagerV2 {
    function getRewardEpochIdsWithClaimableRewards() external view returns (uint24 _startEpochId, uint24 _endEpochId);
    function getNextClaimableRewardEpochId(address _rewardOwner) external view returns (uint256);
    function claim(
        address _rewardOwner,
        address payable _recipient,
        uint24 _rewardEpochId,
        bool _wrap,
        RewardClaimWithProof[] calldata _proofs
    ) external returns (uint256 _rewardAmountWei);
    function getStateOfRewards(
        address _rewardOwner
    ) external view returns (RewardState[][] memory _rewardStates);
    
    struct RewardClaimWithProof {
        bytes32[] merkleProof;
        RewardClaim body;
    }
    
    struct RewardClaim {
        uint24 rewardEpochId;
        bytes20 beneficiary;
        uint120 amount;
        uint8 claimType;
    }
    
    struct RewardState {
        uint24 rewardEpochId;
        bytes20 beneficiary;
        uint120 amount;
        uint8 claimType;
        bool initialised;
    }
}

contract RoyaltyDistributor is ReentrancyGuard, Ownable, Pausable, Multicall {
    IERC721 public erc721Token;
    uint256 public totalTokenSupply;
    address public emergencyWallet;

    address public constant ETH_ADDRESS = address(0);
    mapping(address => bool) public supportedPaymentTokens;
    address[] public supportedTokensList;

    uint256 public constant PRECISION = 1e18;
    mapping(address => uint256) public cumulativeRewardPerToken;
    mapping(uint256 => mapping(address => uint256)) public lastClaimedCumulativeReward;
    mapping(address => uint256) public epochCounter;
    mapping(uint256 => mapping(address => uint256)) public lastClaimedEpoch;
    mapping(address => uint256) public lastKnownBalance;

    address public constant FEE_RECIPIENT = 0x507b104ccE2dd09397731440F38F651f286FF8Ea;
    IWNat public wNat;
    IFtsoRewardManagerV2 public ftsoRewardManager;
    address public ftsoRewardManagerAddress;
    address public ftsoProvider;
    address public executor;

    address constant WNAT_ADDRESS = 0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED;
    address constant INITIAL_FTSO_REWARD_MANAGER_ADDRESS = 0xE26AD68b17224951b5740F33926Cc438764eB9a7;

    event PaymentTokenAdded(address indexed token);
    event PaymentTokenRemoved(address indexed token);
    event RoyaltyReceived(address indexed token, uint256 amount, uint256 epoch);
    event RewardsClaimed(address indexed claimer, uint256[] tokenIds, address[] paymentTokens, uint256[] amounts, uint256 timestamp);
    event EmergencyWalletUpdated(address indexed oldWallet, address indexed newWallet);
    event EmergencyWithdrawal(address indexed token, uint256 amount);
    event Deposited(address indexed sender, uint256 amount);
    event Delegated(address indexed provider, uint256 amount);
    event Undelegated();
    event RewardsClaimedFTSO(uint256 amount);
    event FtsoRewardManagerUpdated(address indexed oldAddress, address indexed newAddress);
    event ExecutorUpdated(address indexed oldExecutor, address indexed newExecutor);
    event RewardsClaimedFTSOWithReason(uint256 amount, string reason);

    error NotAuthorized();
    error InvalidState();
    error InvalidAddress();
    error TokenNotSupported();
    error ZeroAmount();
    error TransferFailed();
    error InsufficientBalance();

    modifier whenOperational() {
        if (paused()) revert InvalidState();
        _;
    }

    constructor(
        uint256 _totalTokenSupply, 
        address _emergencyWallet
    ) Ownable(msg.sender) {
        if (_totalTokenSupply == 0) revert InvalidState();
        if (_emergencyWallet == address(0)) revert InvalidAddress();

        totalTokenSupply = _totalTokenSupply;
        emergencyWallet = _emergencyWallet;

        supportedPaymentTokens[ETH_ADDRESS] = true;
        supportedTokensList.push(ETH_ADDRESS);
        lastKnownBalance[ETH_ADDRESS] = address(this).balance;

        wNat = IWNat(WNAT_ADDRESS);
        ftsoRewardManagerAddress = INITIAL_FTSO_REWARD_MANAGER_ADDRESS;
        ftsoRewardManager = IFtsoRewardManagerV2(ftsoRewardManagerAddress);
        ftsoProvider = address(0);
        executor = address(0);
    }

    function addPaymentToken(address token) external onlyOwner whenOperational {
        if (token == ETH_ADDRESS || token == address(0)) revert InvalidAddress();
        if (supportedPaymentTokens[token]) revert InvalidState();

        try IERC20(token).totalSupply() returns (uint256) {
            supportedPaymentTokens[token] = true;
            supportedTokensList.push(token);
            lastKnownBalance[token] = IERC20(token).balanceOf(address(this));
            cumulativeRewardPerToken[token] = 0;
            emit PaymentTokenAdded(token);
        } catch {
            revert TokenNotSupported();
        }
    }

    function removePaymentToken(address token) external onlyOwner whenOperational {
        if (token == ETH_ADDRESS) revert InvalidState();
        if (!supportedPaymentTokens[token]) revert TokenNotSupported();

        supportedPaymentTokens[token] = false;
        delete cumulativeRewardPerToken[token];
        delete lastKnownBalance[token];

        for (uint256 i = 0; i < supportedTokensList.length; i++) {
            if (supportedTokensList[i] == token) {
                supportedTokensList[i] = supportedTokensList[supportedTokensList.length - 1];
                supportedTokensList.pop();
                break;
            }
        }
        emit PaymentTokenRemoved(token);
    }

    function setTokenContract(address _tokenContract) external onlyOwner whenOperational {
        if (_tokenContract == address(0)) revert InvalidAddress();
        if (!IERC165(_tokenContract).supportsInterface(type(IERC721).interfaceId)) revert InvalidState();
        erc721Token = IERC721(_tokenContract);
    }

    receive() external payable {
        if (msg.value == 0) revert ZeroAmount();
        wrapSGB();
    }

    function _processPayment(address paymentToken, uint256 amount) internal {
        if (amount == 0) revert ZeroAmount();
        if (totalTokenSupply == 0) revert InvalidState();

        epochCounter[paymentToken]++;
        emit RoyaltyReceived(paymentToken, amount, epochCounter[paymentToken]);
        cumulativeRewardPerToken[paymentToken] += (amount * PRECISION) / totalTokenSupply;

        lastKnownBalance[paymentToken] = paymentToken == ETH_ADDRESS
            ? address(this).balance
            : IERC20(paymentToken).balanceOf(address(this));
    }

    function claimRewards(uint256[] calldata tokenIds, address[] calldata paymentTokens) 
        external 
        nonReentrant 
        whenOperational 
    {
        if (tokenIds.length == 0) revert InvalidState();

        address[] memory tokensToProcess;
        if (paymentTokens.length > 0) {
            tokensToProcess = paymentTokens;
        } else {
            tokensToProcess = new address[](supportedTokensList.length);
            for (uint256 i = 0; i < supportedTokensList.length; i++) {
                tokensToProcess[i] = supportedTokensList[i];
            }
        }

        uint256[] memory amounts = new uint256[](tokensToProcess.length);
        bool hasClaim = false;

        for (uint256 j = 0; j < tokensToProcess.length; j++) {
            address paymentToken = tokensToProcess[j];
            if (!supportedPaymentTokens[paymentToken]) revert TokenNotSupported();

            uint256 currentEpoch = epochCounter[paymentToken];
            uint256 totalClaimable = 0;

            for (uint256 i = 0; i < tokenIds.length; i++) {
                uint256 tokenId = tokenIds[i];
                if (erc721Token.ownerOf(tokenId) != msg.sender) revert NotAuthorized();
                if (!isValidTokenId(tokenId)) revert InvalidState();

                uint256 lastEpoch = lastClaimedEpoch[tokenId][paymentToken];
                if (lastEpoch < currentEpoch) {
                    uint256 lastCumulative = lastClaimedCumulativeReward[tokenId][paymentToken];
                    uint256 currentCumulative = cumulativeRewardPerToken[paymentToken];
                    uint256 claimable = (currentCumulative - lastCumulative) / PRECISION;
                    totalClaimable += claimable;
                    lastClaimedEpoch[tokenId][paymentToken] = currentEpoch;
                    lastClaimedCumulativeReward[tokenId][paymentToken] = currentCumulative;
                }
            }

            if (totalClaimable > 0) {
                uint256 paymentBalance = paymentToken == ETH_ADDRESS
                    ? address(this).balance
                    : IERC20(paymentToken).balanceOf(address(this));
                if (paymentBalance < totalClaimable) totalClaimable = paymentBalance;

                uint256 fee = (totalClaimable * 3) / 1000; // 0.3% fee
                uint256 amountAfterFee = totalClaimable - fee;

                if (paymentToken == ETH_ADDRESS) {
                    (bool feeSuccess, ) = payable(FEE_RECIPIENT).call{value: fee}("");
                    if (!feeSuccess) revert TransferFailed();
                } else {
                    bool success = IERC20(paymentToken).transfer(FEE_RECIPIENT, fee);
                    if (!success) revert TransferFailed();
                }

                amounts[j] = amountAfterFee;
                _transferRewards(msg.sender, paymentToken, amountAfterFee);
                hasClaim = true;
            }
        }

        if (!hasClaim) revert InvalidState();
        emit RewardsClaimed(msg.sender, tokenIds, tokensToProcess, amounts, block.timestamp);
    }

    function processAccumulatedERC20Payments(address[] calldata erc20Tokens) 
        external 
        nonReentrant 
        whenOperational 
    {
        if (erc20Tokens.length == 0) revert InvalidState();

        for (uint256 i = 0; i < erc20Tokens.length; i++) {
            address token = erc20Tokens[i];
            if (!supportedPaymentTokens[token] || token == ETH_ADDRESS) revert TokenNotSupported();

            uint256 currentBalance = IERC20(token).balanceOf(address(this));
            uint256 newAmount = currentBalance > lastKnownBalance[token] 
                ? currentBalance - lastKnownBalance[token] 
                : 0;
            if (newAmount > 0) _processPayment(token, newAmount);
        }
    }

    function updateEmergencyWallet(address _newWallet) external onlyOwner {
        if (_newWallet == address(0)) revert InvalidAddress();
        address oldWallet = emergencyWallet;
        emergencyWallet = _newWallet;
        emit EmergencyWalletUpdated(oldWallet, _newWallet);
    }

    function executeEmergencyWithdrawal() external onlyOwner nonReentrant {
        uint256 ethBalance = address(this).balance;
        if (ethBalance > 0) {
            (bool success, ) = emergencyWallet.call{value: ethBalance}("");
            if (!success) revert TransferFailed();
            lastKnownBalance[ETH_ADDRESS] = 0;
            emit EmergencyWithdrawal(ETH_ADDRESS, ethBalance);
        }

        for (uint256 i = 0; i < supportedTokensList.length; i++) {
            address token = supportedTokensList[i];
            if (token == ETH_ADDRESS) continue;

            uint256 balance = IERC20(token).balanceOf(address(this));
            if (balance > 0) {
                bool success = IERC20(token).transfer(emergencyWallet, balance);
                if (!success) revert TransferFailed();
                lastKnownBalance[token] = 0;
                emit EmergencyWithdrawal(token, balance);
            }
        }
    }

    function wrapSGB() public payable {
        if (msg.value == 0) revert ZeroAmount();
        wNat.deposit{value: msg.value}();
        emit Deposited(msg.sender, msg.value);

        if (ftsoProvider != address(0)) {
            uint256 balance = wNat.balanceOf(address(this));
            if (balance > 0) {
                wNat.delegate(ftsoProvider, 10000);
                emit Delegated(ftsoProvider, balance);
            }
        }
    }

    // Updated claimFTSORewards function inspired by Delegator's _tryClaimWNatRewards
    uint24 public nextClaimEpoch; // Track the next epoch to claim

    function claimFTSORewards() external nonReentrant whenOperational {
        if (msg.sender != executor && msg.sender != owner()) revert NotAuthorized();

        if (ftsoRewardManagerAddress == address(0)) {
            emit RewardsClaimedFTSOWithReason(0, "Reward manager not set");
            return;
        }

        if (nextClaimEpoch == 0) {
            // Initialize nextClaimEpoch to the next epoch after the current one
            try ftsoRewardManager.getNextClaimableRewardEpochId(address(this)) returns (uint256 nextEpoch) {
                nextClaimEpoch = uint24(nextEpoch);
            } catch {
                emit RewardsClaimedFTSOWithReason(0, "Failed to initialize next claim epoch");
                return;
            }
            emit RewardsClaimedFTSO(0);
            return;
        }

        (uint24 startEpochId, uint24 endEpochId) = (0, 0);
        try ftsoRewardManager.getRewardEpochIdsWithClaimableRewards() returns (
            uint24 _startEpochId,
            uint24 _endEpochId
        ) {
            startEpochId = _startEpochId;
            endEpochId = _endEpochId;
        } catch {
            emit RewardsClaimedFTSOWithReason(0, "Failed to get claimable epochs");
            return;
        }

        if (endEpochId >= nextClaimEpoch) {
            uint256 totalRewardAmount = 0;
            for (uint24 epoch = nextClaimEpoch; epoch <= endEpochId; epoch++) {
                try ftsoRewardManager.claim(
                    address(this),
                    payable(address(this)),
                    epoch,
                    true,
                    new IFtsoRewardManagerV2.RewardClaimWithProof[](0)
                ) returns (uint256 rewardAmountWei) {
                    totalRewardAmount += rewardAmountWei;
                } catch Error(string memory reason) {
                    emit RewardsClaimedFTSOWithReason(0, string(abi.encodePacked("Failed to claim epoch ", uintToString(epoch), ": ", reason)));
                    continue; // Continue with the next epoch
                } catch {
                    emit RewardsClaimedFTSOWithReason(0, string(abi.encodePacked("Unknown error claiming epoch ", uintToString(epoch))));
                    continue; // Continue with the next epoch
                }
            }

            if (totalRewardAmount > 0) {
                _processPayment(ETH_ADDRESS, totalRewardAmount);
                emit RewardsClaimedFTSO(totalRewardAmount);
            } else {
                emit RewardsClaimedFTSO(0);
            }

            nextClaimEpoch = endEpochId + 1;
        } else {
            emit RewardsClaimedFTSO(0);
        }
    }

    // Helper function to convert uint to string for error messages
    function uintToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function hasClaimableFTSORewards() external view returns (bool) {
        (uint24 startEpochId, uint24 endEpochId) = ftsoRewardManager.getRewardEpochIdsWithClaimableRewards();
        uint24 nextClaimableEpochId = uint24(ftsoRewardManager.getNextClaimableRewardEpochId(address(this)));
        
        if (nextClaimableEpochId > startEpochId) {
            startEpochId = nextClaimableEpochId;
        }

        return startEpochId <= endEpochId;
    }

    function setFtsoProvider(address newProvider) external onlyOwner {
        if (newProvider == address(0)) revert InvalidAddress();
        ftsoProvider = newProvider;
        uint256 balance = wNat.balanceOf(address(this));
        if (balance > 0) {
            wNat.delegate(newProvider, 10000);
            emit Delegated(newProvider, balance);
        }
    }

    function undelegateAll() external onlyOwner {
        wNat.undelegateAll();
        ftsoProvider = address(0);
        emit Undelegated();
    }

    function setFtsoRewardManager(address newManager) external onlyOwner {
        if (newManager == address(0)) revert InvalidAddress();
        address oldManager = ftsoRewardManagerAddress;
        ftsoRewardManagerAddress = newManager;
        ftsoRewardManager = IFtsoRewardManagerV2(newManager);
        emit FtsoRewardManagerUpdated(oldManager, newManager);
    }

    function setExecutor(address newExecutor) external onlyOwner {
        if (newExecutor == address(0)) revert InvalidAddress();
        address oldExecutor = executor;
        executor = newExecutor;
        emit ExecutorUpdated(oldExecutor, newExecutor);
    }

    function getWSGBBalance() external view returns (uint256) {
        return wNat.balanceOf(address(this));
    }

    function _transferRewards(address recipient, address paymentToken, uint256 amount) internal {
        uint256 currentBalance = paymentToken == ETH_ADDRESS
            ? address(this).balance
            : IERC20(paymentToken).balanceOf(address(this));
        if (currentBalance < amount) revert InsufficientBalance();

        if (paymentToken == ETH_ADDRESS) {
            (bool success, ) = payable(recipient).call{value: amount}("");
            if (!success) revert TransferFailed();
            lastKnownBalance[paymentToken] = address(this).balance;
        } else {
            bool success = IERC20(paymentToken).transfer(recipient, amount);
            if (!success) revert TransferFailed();
            lastKnownBalance[paymentToken] = IERC20(paymentToken).balanceOf(address(this));
        }
    }

    function isValidTokenId(uint256 tokenId) public pure returns (bool) {
        return tokenId > 0;
    }

    function getClaimableTokens(address user, uint256[] calldata tokenIds) 
        external 
        view 
        returns (address[] memory) 
    {
        address[] memory temp = new address[](supportedTokensList.length);
        uint256 count = 0;

        for (uint256 i = 0; i < supportedTokensList.length; i++) {
            address paymentToken = supportedTokensList[i];
            for (uint256 j = 0; j < tokenIds.length; j++) {
                uint256 tokenId = tokenIds[j];
                if (erc721Token.ownerOf(tokenId) == user && isValidTokenId(tokenId)) {
                    uint256 lastEpoch = lastClaimedEpoch[tokenId][paymentToken];
                    uint256 currentEpoch = epochCounter[paymentToken];
                    if (currentEpoch > lastEpoch) {
                        temp[count] = paymentToken;
                        count++;
                        break;
                    }
                }
            }
        }

        address[] memory result = new address[](count);
        for (uint256 k = 0; k < count; k++) {
            result[k] = temp[k];
        }
        return result;
    }

    function getSupportedPaymentTokens() external view returns (address[] memory) {
        return supportedTokensList;
    }
}
