// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ITRC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract GoldRewards {
    address public admin;
    ITRC20 public token; // TRC20 Token Address
    mapping(address => uint256) public rewards;
    uint256 public commissionRate = 30; // 30% commission

    event RewardAdded(address indexed user, uint256 amount, uint256 commission);
    event RewardClaimed(address indexed user, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    modifier nonReentrant() {
        require(!locked, "Reentrancy detected");
        locked = true;
        _;
        locked = false;
    }

    bool private locked;

    constructor(address _tokenAddress) {
        require(_tokenAddress != address(0), "Invalid token address");

        admin = msg.sender;
        token = ITRC20(_tokenAddress);
    }

    // Add reward after deducting 30% commission
    function addReward(address user, uint256 amount) external payable {
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Amount must be greater than zero");

        uint256 commission = (amount * commissionRate) / 100;
        uint256 finalReward = amount - commission;

        rewards[user] += finalReward;

        emit RewardAdded(user, finalReward, commission);
    }

    // Users claim rewards in TRX & equivalent TRC20 tokens
    function claimReward() external nonReentrant {
        uint256 rewardAmount = rewards[msg.sender];
        require(rewardAmount > 0, "No rewards to claim");
        require(token.balanceOf(address(this)) >= rewardAmount, "Insufficient token balance");

        rewards[msg.sender] = 0;

        // Transfer TRC20 token reward
        require(token.transfer(msg.sender, rewardAmount), "Token transfer failed");

        emit RewardClaimed(msg.sender, rewardAmount);
    }

    // Allow the contract to receive TRX
    receive() external payable {}
    
    function setAdmin(address _admin) external onlyAdmin {
        admin = _admin ; 
    }

    // Withdraw contract balance by admin
    function withdrawFunds(uint256 amount) external onlyAdmin {
        require(address(this).balance >= amount, "Insufficient funds");
        (bool success, ) = payable(admin).call{value: amount}("");
        require(success, "Withdraw failed");
    }

    // Withdraw TRC20 tokens by admin
    function withdrawTokens(uint256 amount) external onlyAdmin {
        require(token.balanceOf(address(this)) >= amount, "Insufficient token balance");
        require(token.transfer(admin, amount), "Token withdrawal failed");
    }
}
