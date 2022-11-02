// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TwoInchToken is ERC20, ERC20Burnable, ERC20Capped, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _capSupply
    ) ERC20(_name, _symbol) ERC20Capped(_capSupply) {
        _mint(msg.sender, 1_000_000_000 * 10**18);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mint(uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(msg.sender, amount);
    }

    function mintFor(address account, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(account, amount);
    }

    function _mint(address account, uint256 amount) internal override(ERC20, ERC20Capped) {
        ERC20Capped._mint(account, amount);
    }

    function burn(uint256 amount) public override onlyRole(MINTER_ROLE) {
        super.burn(amount);
    }

    function burnFrom(address account, uint256 amount) public override onlyRole(MINTER_ROLE) {
        super.burnFrom(account, amount);
    }
}
