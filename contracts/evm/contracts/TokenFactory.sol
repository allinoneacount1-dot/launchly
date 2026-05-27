// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

import "./LaunchlyToken.sol";

/**
 * @title TokenFactory
 * @notice Deploys minimal-proxy (clone) LaunchlyToken contracts.
 * @dev Uses EIP-1167 clones for ~10x cheaper deployment. Each token is its own proxy
 *      that delegates to a single implementation. Creator is set as the initial owner.
 */
contract TokenFactory is ReentrancyGuard {
    using Clones for address;

    /// @notice The single LaunchlyToken implementation that all clones delegate to.
    address public immutable implementation;

    /// @notice All tokens ever created by this factory.
    address[] public allTokens;

    /// @notice All tokens created by a specific address.
    mapping(address => address[]) public tokensByCreator;

    /// @notice The fee to create a token (paid in native token).
    uint256 public createFee;

    /// @notice The address that collects fees.
    address public feeCollector;

    event TokenCreated(
        uint256 indexed tokenId,
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        uint8 decimals,
        uint256 initialSupply,
        uint256 timestamp
    );
    event FeeUpdated(uint256 oldFee, uint256 newFee);
    event FeeCollectorUpdated(address oldCollector, address newCollector);

    constructor(address _implementation, address _feeCollector) {
        implementation = _implementation;
        feeCollector = _feeCollector;
        createFee = 0 ether; // free by default; owner can set a fee
    }

    function createToken(
        string calldata name,
        string calldata symbol,
        uint8 decimals,
        uint256 initialSupply
    ) external payable nonReentrant returns (address tokenProxy) {
        require(msg.value >= createFee, "TokenFactory: insufficient fee");

        // Deploy a minimal proxy clone
        tokenProxy = implementation.clone();

        // Initialize the clone with token parameters
        LaunchlyToken(payable(tokenProxy)).initialize(
            name,
            symbol,
            decimals,
            initialSupply,
            msg.sender
        );

        // Track the token
        allTokens.push(tokenProxy);
        tokensByCreator[msg.sender].push(tokenProxy);

        // Forward fee
        if (createFee > 0 && feeCollector != address(0)) {
            (bool ok, ) = feeCollector.call{value: createFee}("");
            require(ok, "TokenFactory: fee transfer failed");
            // Refund any excess
            uint256 excess = msg.value - createFee;
            if (excess > 0) {
                (bool ok2, ) = msg.sender.call{value: excess}("");
                require(ok2, "TokenFactory: refund failed");
            }
        }

        emit TokenCreated(
            allTokens.length - 1,
            tokenProxy,
            msg.sender,
            name,
            symbol,
            decimals,
            initialSupply,
            block.timestamp
        );
    }

    // ---- view helpers ----

    function getTokenCount() external view returns (uint256) {
        return allTokens.length;
    }

    function getTokensByCreator(address creator) external view returns (address[] memory) {
        return tokensByCreator[creator];
    }

    function getTokenInfo(address token) external view returns (
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 totalSupply,
        bool mintingFinished
    ) {
        LaunchlyToken t = LaunchlyToken(payable(token));
        return (t.name(), t.symbol(), t.decimals(), t.totalSupply(), t.isMintingFinished());
    }

    // ---- owner (fee management) ----

    function setFee(uint256 newFee) external {
        require(msg.sender == feeCollector, "TokenFactory: not authorized");
        uint256 old = createFee;
        createFee = newFee;
        emit FeeUpdated(old, newFee);
    }

    function setFeeCollector(address newCollector) external {
        require(msg.sender == feeCollector, "TokenFactory: not authorized");
        address old = feeCollector;
        feeCollector = newCollector;
        emit FeeCollectorUpdated(old, newCollector);
    }
}
