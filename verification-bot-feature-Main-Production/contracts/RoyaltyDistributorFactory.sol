// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RoyaltyDistributor.sol";

contract RoyaltyDistributorFactory {
    // Array to store all deployed RoyaltyDistributor contracts
    address[] public deployedDistributors;
    
    // Mapping to track which addresses deployed which contracts
    mapping(address => address[]) public distributorByCreator;

    // Version identifier for the RoyaltyDistributor implementation
    string public constant VERSION = "1.0.0";

    // Event emitted when a new RoyaltyDistributor is deployed
    event DistributorDeployed(
        address indexed creator,
        address indexed distributorAddress,
        uint256 totalTokenSupply,
        address emergencyWallet,
        string version,
        uint256 timestamp
    );

    // Custom errors
    error InvalidTotalTokenSupply();
    error InvalidEmergencyWallet();

    // Deploy a new RoyaltyDistributor contract
    function deployRoyaltyDistributor(
        uint256 _totalTokenSupply,
        address _emergencyWallet
    ) external returns (address) {
        if (_totalTokenSupply == 0) revert InvalidTotalTokenSupply();
        if (_emergencyWallet == address(0)) revert InvalidEmergencyWallet();

        // Deploy a new instance of RoyaltyDistributor
        RoyaltyDistributor newDistributor = new RoyaltyDistributor(_totalTokenSupply, _emergencyWallet);

        // Transfer ownership to the caller
        newDistributor.transferOwnership(msg.sender);

        // Store the deployed contract address
        deployedDistributors.push(address(newDistributor));
        distributorByCreator[msg.sender].push(address(newDistributor));

        // Emit event for frontend tracking
        emit DistributorDeployed(
            msg.sender,
            address(newDistributor),
            _totalTokenSupply,
            _emergencyWallet,
            VERSION,
            block.timestamp
        );

        return address(newDistributor);
    }

    // Get the total number of deployed distributors
    function getDeployedDistributorsCount() external view returns (uint256) {
        return deployedDistributors.length;
    }

    // Get all deployed distributor addresses
    function getAllDeployedDistributors() external view returns (address[] memory) {
        return deployedDistributors;
    }

    // Get the number of distributors deployed by a specific creator
    function getCreatorDistributorsCount(address creator) external view returns (uint256) {
        return distributorByCreator[creator].length;
    }

    // Get all distributor addresses deployed by a specific creator
    function getCreatorDistributors(address creator) external view returns (address[] memory) {
        return distributorByCreator[creator];
    }
}
