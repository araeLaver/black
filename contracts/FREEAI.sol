// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FreeAIToken is ERC20, ERC20Burnable, Ownable, ReentrancyGuard {
    
    // Token Details
    uint256 private constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1B tokens
    
    // Fee Structure
    uint256 public buyFee = 100; // 1% (100/10000)
    uint256 public sellFee = 100; // 1% (100/10000)
    uint256 public constant MAX_FEE = 500; // Max 5%
    
    // Fee Distribution
    uint256 public burnPercentage = 50; // 50% of fees burned
    uint256 public devPercentage = 50;  // 50% of fees to dev
    
    // Addresses
    address public devWallet;
    address public deadAddress = 0x000000000000000000000000000000000000dEaD;
    
    // Trading Control
    bool public tradingEnabled = false;
    mapping(address => bool) public isExcludedFromFees;
    mapping(address => bool) public automatedMarketMakerPairs;
    
    // Anti-whale (optional)
    uint256 public maxWalletAmount;
    uint256 public maxTransactionAmount;
    
    // Events
    event TradingEnabled();
    event FeesUpdated(uint256 buyFee, uint256 sellFee);
    event DevWalletUpdated(address indexed newDevWallet);
    event AutomatedMarketMakerPairUpdated(address indexed pair, bool indexed value);
    
    constructor(address _devWallet) ERC20("Free AI Token", "FREEAI") {
        devWallet = _devWallet;
        
        // Initial supply distribution
        uint256 airdropAmount = (TOTAL_SUPPLY * 70) / 100; // 70% for airdrop
        uint256 devAmount = (TOTAL_SUPPLY * 5) / 100;      // 5% for dev (locked)
        uint256 liquidityReserve = (TOTAL_SUPPLY * 20) / 100; // 20% for future liquidity
        uint256 marketingReserve = (TOTAL_SUPPLY * 5) / 100;  // 5% for marketing/rewards
        
        _mint(owner(), airdropAmount + liquidityReserve + marketingReserve);
        _mint(devWallet, devAmount);
        
        // Set anti-whale limits (10% of supply initially)
        maxWalletAmount = (TOTAL_SUPPLY * 10) / 100;
        maxTransactionAmount = (TOTAL_SUPPLY * 5) / 100;
        
        // Exclude from fees
        isExcludedFromFees[owner()] = true;
        isExcludedFromFees[devWallet] = true;
        isExcludedFromFees[address(this)] = true;
        isExcludedFromFees[deadAddress] = true;
    }
    
    receive() external payable {}
    
    // Enable trading (only once)
    function enableTrading() external onlyOwner {
        require(!tradingEnabled, "Trading already enabled");
        tradingEnabled = true;
        emit TradingEnabled();
    }
    
    // Update fees
    function updateFees(uint256 _buyFee, uint256 _sellFee) external onlyOwner {
        require(_buyFee <= MAX_FEE && _sellFee <= MAX_FEE, "Fees too high");
        buyFee = _buyFee;
        sellFee = _sellFee;
        emit FeesUpdated(_buyFee, _sellFee);
    }
    
    // Update dev wallet
    function updateDevWallet(address _newDevWallet) external onlyOwner {
        require(_newDevWallet != address(0), "Invalid address");
        devWallet = _newDevWallet;
        isExcludedFromFees[_newDevWallet] = true;
        emit DevWalletUpdated(_newDevWallet);
    }
    
    // Set AMM pairs
    function setAutomatedMarketMakerPair(address pair, bool value) external onlyOwner {
        automatedMarketMakerPairs[pair] = value;
        emit AutomatedMarketMakerPairUpdated(pair, value);
    }
    
    // Exclude/include from fees
    function excludeFromFees(address account, bool excluded) external onlyOwner {
        isExcludedFromFees[account] = excluded;
    }
    
    // Update anti-whale limits
    function updateLimits(uint256 _maxWallet, uint256 _maxTx) external onlyOwner {
        require(_maxWallet >= TOTAL_SUPPLY / 100, "Max wallet too low"); // Min 1%
        require(_maxTx >= TOTAL_SUPPLY / 200, "Max tx too low"); // Min 0.5%
        maxWalletAmount = _maxWallet;
        maxTransactionAmount = _maxTx;
    }
    
    // Remove limits (for mature token)
    function removeLimits() external onlyOwner {
        maxWalletAmount = TOTAL_SUPPLY;
        maxTransactionAmount = TOTAL_SUPPLY;
    }
    
    // Airdrop function
    function airdrop(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            _transfer(msg.sender, recipients[i], amounts[i]);
        }
    }
    
    // Bulk airdrop (same amount to all)
    function bulkAirdrop(address[] calldata recipients, uint256 amount) external onlyOwner {
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            _transfer(msg.sender, recipients[i], amount);
        }
    }
    
    // Emergency functions
    function rescueETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function rescueTokens(address tokenAddress) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        token.transfer(owner(), token.balanceOf(address(this)));
    }
    
    // Override transfer function to implement fees
    function _transfer(address from, address to, uint256 amount) internal override {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        
        // Check if trading is enabled
        if (!tradingEnabled) {
            require(isExcludedFromFees[from] || isExcludedFromFees[to], "Trading not enabled");
        }
        
        // Check transaction limits
        if (from != owner() && to != owner() && !isExcludedFromFees[from] && !isExcludedFromFees[to]) {
            require(amount <= maxTransactionAmount, "Transfer amount exceeds limit");
            
            // Check max wallet for buys and regular transfers (but not sells)
            if (!automatedMarketMakerPairs[to] && to != address(0)) {
                require(balanceOf(to) + amount <= maxWalletAmount, "Wallet amount exceeds limit");
            }
        }
        
        // Calculate fees
        bool takeFee = !isExcludedFromFees[from] && !isExcludedFromFees[to];
        
        if (takeFee) {
            uint256 fees = 0;
            
            // Buy fees (from AMM pair)
            if (automatedMarketMakerPairs[from] && buyFee > 0) {
                fees = (amount * buyFee) / 10000;
            }
            // Sell fees (to AMM pair)
            else if (automatedMarketMakerPairs[to] && sellFee > 0) {
                fees = (amount * sellFee) / 10000;
            }
            
            if (fees > 0) {
                uint256 burnAmount = (fees * burnPercentage) / 100;
                uint256 devAmount = fees - burnAmount;
                
                // Burn tokens
                if (burnAmount > 0) {
                    super._transfer(from, deadAddress, burnAmount);
                }
                
                // Send to dev wallet
                if (devAmount > 0) {
                    super._transfer(from, devWallet, devAmount);
                }
                
                amount -= fees;
            }
        }
        
        super._transfer(from, to, amount);
    }
    
    // View functions
    function getCirculatingSupply() external view returns (uint256) {
        return totalSupply() - balanceOf(deadAddress);
    }
    
    function isExcludedFromFee(address account) external view returns (bool) {
        return isExcludedFromFees[account];
    }
}