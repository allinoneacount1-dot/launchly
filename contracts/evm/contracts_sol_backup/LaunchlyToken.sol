// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/**
 * @title LaunchlyToken
 * @notice Upgradeable ERC-20 token used as the implementation for TokenFactory clones.
 * @dev The `initialize` function replaces the constructor for proxy patterns.
 */
contract LaunchlyToken is
    ERC20Upgradeable,
    ERC20BurnableUpgradeable,
    ERC20PausableUpgradeable,
    OwnableUpgradeable
{
    string private _tokenName;
    string private _tokenSymbol;
    uint8 private _tokenDecimals;
    bool private _mintingFinished;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply,
        address initialOwner
    ) public initializer {
        __ERC20_init(name_, symbol_);
        __ERC20Burnable_init();
        __ERC20Pausable_init();
        __Ownable_init(initialOwner);

        _tokenName = name_;
        _tokenSymbol = symbol_;
        _tokenDecimals = decimals_;

        if (initialSupply > 0) {
            _mint(initialOwner, initialSupply * 10 ** decimals_);
        }
    }

    function name() public view override returns (string memory) { return _tokenName; }
    function symbol() public view override returns (string memory) { return _tokenSymbol; }
    function decimals() public view override returns (uint8) { return _tokenDecimals; }

    function mint(address to, uint256 amount) external onlyOwner {
        require(!_mintingFinished, "LaunchlyToken: minting finished");
        _mint(to, amount);
    }

    function finishMinting() external onlyOwner {
        _mintingFinished = true;
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20Upgradeable, ERC20PausableUpgradeable)
    {
        super._update(from, to, value);
    }
}
