// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./WagmiToken.sol";

contract BuilderBadgeToken is ERC1155, Ownable {
    WagmiToken public wagmiToken;

    mapping(uint256 => uint256) public badgeRequirements;

    constructor(address _wagmiToken, address initialOwner) ERC1155("https://orange-concerned-dormouse-303.mypinata.cloud/ipfs/bafybeidqsfiqc4zfqhvcnzxj4e2qc4lers2virqulyeaijn7scxb2soq64/") Ownable(initialOwner) {
        wagmiToken = WagmiToken(_wagmiToken);

        // Set badge requirements
        badgeRequirements[1] = 100;  // Builder
        badgeRequirements[2] = 300;  // Prominent Builder
        badgeRequirements[3] = 600;  // Master Builder
        badgeRequirements[4] = 1000; // Architect
        badgeRequirements[5] = 1500; // Visionary
    }

    function mintBadge(uint256 badgeId) external {
        require(badgeRequirements[badgeId] > 0, "Invalid badge ID");
        uint256 requiredAmount = badgeRequirements[badgeId];
        require(wagmiToken.balanceOf(msg.sender) >= requiredAmount, "Insufficient $WAGMI tokens");

        // Burn the required amount of $WAGMI tokens
        wagmiToken.burnFrom(msg.sender, requiredAmount);

        // Mint the badge
        _mint(msg.sender, badgeId, 1, "");
    }
}