/**
 * ShopVerse Phase 4: Blockchain & Web3 Integration Module
 * Advanced blockchain features, NFT marketplace, and crypto payments
 * @version 1.0.0
 */

class BlockchainFeatures {
    constructor() {
        this.isInitialized = false;
        this.web3 = null;
        this.provider = null;
        this.signer = null;
        this.connectedAccount = null;
        this.supportedNetworks = new Map();
        this.contracts = new Map();
        this.walletConnectors = new Map();
        
        this.init();
    }
    
    async init() {
        try {
            await this.checkWeb3Capabilities();
            this.setupSupportedNetworks();
            this.setupWalletConnectors();
            this.initializeEventHandlers();
            this.isInitialized = true;
            console.log('Blockchain Features initialized successfully');
        } catch (error) {
            console.error('Blockchain Features initialization failed:', error);
        }
    }
    
    async checkWeb3Capabilities() {
        this.capabilities = {
            ethereum: typeof window.ethereum !== 'undefined',
            web3: typeof Web3 !== 'undefined',
            ethers: typeof ethers !== 'undefined',
            metamask: typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask,
            walletConnect: typeof WalletConnectProvider !== 'undefined',
            localStorage: typeof Storage !== 'undefined'
        };
        
        console.log('Web3 Capabilities:', this.capabilities);
        return this.capabilities;
    }
    
    setupSupportedNetworks() {
        this.supportedNetworks.set(1, {
            name: 'Ethereum Mainnet',
            chainId: 1,
            rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            blockExplorer: 'https://etherscan.io',
            icon: 'fab fa-ethereum',
            color: '#627eea'
        });
        
        this.supportedNetworks.set(137, {
            name: 'Polygon Mainnet',
            chainId: 137,
            rpcUrl: 'https://polygon-rpc.com',
            nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
            blockExplorer: 'https://polygonscan.com',
            icon: 'fas fa-hexagon',
            color: '#8247e5'
        });
        
        this.supportedNetworks.set(56, {
            name: 'BSC Mainnet',
            chainId: 56,
            rpcUrl: 'https://bsc-dataseed.binance.org',
            nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
            blockExplorer: 'https://bscscan.com',
            icon: 'fas fa-coins',
            color: '#f0b90b'
        });
    }
    
    setupWalletConnectors() {
        // MetaMask connector
        if (this.capabilities.metamask) {
            this.walletConnectors.set('metamask', {
                name: 'MetaMask',
                icon: 'fas fa-fox',
                connect: this.connectMetaMask.bind(this),
                isAvailable: () => typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask
            });
        }
        
        // WalletConnect connector
        if (this.capabilities.walletConnect) {
            this.walletConnectors.set('walletconnect', {
                name: 'WalletConnect',
                icon: 'fas fa-qrcode',
                connect: this.connectWalletConnect.bind(this),
                isAvailable: () => typeof WalletConnectProvider !== 'undefined'
            });
        }
        
        // Coinbase Wallet connector
        this.walletConnectors.set('coinbase', {
            name: 'Coinbase Wallet',
            icon: 'fas fa-coins',
            connect: this.connectCoinbaseWallet.bind(this),
            isAvailable: () => typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet
        });
    }
    
    initializeEventHandlers() {
        // Wallet connection buttons
        const connectWalletBtn = document.getElementById('connectWallet');
        const connectWeb3WalletBtn = document.getElementById('connectWeb3Wallet');
        const walletModal = document.getElementById('walletModal');
        const walletModalClose = document.getElementById('walletModalClose');
        
        if (connectWalletBtn) {
            connectWalletBtn.addEventListener('click', () => this.showWalletModal());
        }
        
        if (connectWeb3WalletBtn) {
            connectWeb3WalletBtn.addEventListener('click', () => this.showWalletModal());
        }
        
        if (walletModalClose) {
            walletModalClose.addEventListener('click', () => this.hideWalletModal());
        }
        
        if (walletModal) {
            walletModal.addEventListener('click', (e) => {
                if (e.target === walletModal) this.hideWalletModal();
            });
        }
        
        // Wallet option clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.wallet-option')) {
                const walletType = e.target.closest('.wallet-option').getAttribute('data-wallet');
                this.connectWallet(walletType);
            }
        });
        
        // Demo button handlers
        document.addEventListener('click', (e) => {
            if (e.target.matches('.demo-btn')) {
                const demoType = e.target.getAttribute('data-demo');
                this.handleBlockchainDemo(demoType);
            }
        });
        
        // Account changes
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                this.handleAccountChange(accounts);
            });
            
            window.ethereum.on('chainChanged', (chainId) => {
                this.handleChainChange(chainId);
            });
        }
        
        // Initialize live crypto prices
        this.startCryptoPriceUpdates();
    }
    
    showWalletModal() {
        const modal = document.getElementById('walletModal');
        if (modal) {
            modal.classList.add('active');
            this.updateWalletAvailability();
        }
    }
    
    hideWalletModal() {
        const modal = document.getElementById('walletModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
    
    updateWalletAvailability() {
        document.querySelectorAll('.wallet-option').forEach(option => {
            const walletType = option.getAttribute('data-wallet');
            const connector = this.walletConnectors.get(walletType);
            
            if (connector && connector.isAvailable()) {
                option.classList.add('available');
                option.classList.remove('unavailable');
            } else {
                option.classList.add('unavailable');
                option.classList.remove('available');
            }
        });
    }
    
    async connectWallet(walletType) {
        try {
            const connector = this.walletConnectors.get(walletType);
            if (!connector) {
                throw new Error(`Wallet connector ${walletType} not found`);
            }
            
            if (!connector.isAvailable()) {
                throw new Error(`${connector.name} is not available`);
            }
            
            const connection = await connector.connect();
            this.handleSuccessfulConnection(connection, walletType);
            this.hideWalletModal();
            
        } catch (error) {
            console.error('Wallet connection failed:', error);
            this.showNotification(error.message, 'error');
        }
    }
    
    async connectMetaMask() {
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            throw new Error('MetaMask not found. Please install MetaMask.');
        }
        
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            
            if (accounts.length === 0) {
                throw new Error('No accounts found');
            }
            
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.signer = this.provider.getSigner();
            
            return {
                account: accounts[0],
                provider: this.provider,
                signer: this.signer
            };
        } catch (error) {
            throw new Error(`MetaMask connection failed: ${error.message}`);
        }
    }
    
    async connectWalletConnect() {
        if (typeof WalletConnectProvider === 'undefined') {
            throw new Error('WalletConnect not available');
        }
        
        try {
            const provider = new WalletConnectProvider({
                infuraId: 'YOUR_INFURA_ID' // Replace with actual Infura ID
            });
            
            await provider.enable();
            
            this.provider = new ethers.providers.Web3Provider(provider);
            this.signer = this.provider.getSigner();
            
            const accounts = await provider.request({
                method: 'eth_accounts'
            });
            
            return {
                account: accounts[0],
                provider: this.provider,
                signer: this.signer
            };
        } catch (error) {
            throw new Error(`WalletConnect connection failed: ${error.message}`);
        }
    }
    
    async connectCoinbaseWallet() {
        if (!window.ethereum || !window.ethereum.isCoinbaseWallet) {
            throw new Error('Coinbase Wallet not found');
        }
        
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.signer = this.provider.getSigner();
            
            return {
                account: accounts[0],
                provider: this.provider,
                signer: this.signer
            };
        } catch (error) {
            throw new Error(`Coinbase Wallet connection failed: ${error.message}`);
        }
    }
    
    handleSuccessfulConnection(connection, walletType) {
        this.connectedAccount = connection.account;
        this.provider = connection.provider;
        this.signer = connection.signer;
        
        // Update UI
        this.updateConnectionStatus(true, walletType);
        
        // Store connection info
        localStorage.setItem('connectedWallet', walletType);
        localStorage.setItem('connectedAccount', connection.account);
        
        this.showNotification(`Connected to ${walletType}`, 'success');
        
        // Load user's blockchain data
        this.loadUserBlockchainData();
    }
    
    updateConnectionStatus(connected, walletType = null) {
        const connectButtons = document.querySelectorAll('.wallet-connect-btn, #connectWeb3Wallet');
        
        connectButtons.forEach(btn => {
            if (connected) {
                btn.classList.add('connected');
                btn.innerHTML = `<i class="fas fa-check"></i> ${this.truncateAddress(this.connectedAccount)}`;
            } else {
                btn.classList.remove('connected');
                btn.innerHTML = '<i class="fas fa-wallet"></i> Connect Wallet';
            }
        });
    }
    
    truncateAddress(address) {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    
    handleAccountChange(accounts) {
        if (accounts.length === 0) {
            this.disconnectWallet();
        } else if (accounts[0] !== this.connectedAccount) {
            this.connectedAccount = accounts[0];
            this.updateConnectionStatus(true);
            this.loadUserBlockchainData();
        }
    }
    
    handleChainChange(chainId) {
        const networkId = parseInt(chainId, 16);
        console.log('Network changed to:', networkId);
        
        if (this.supportedNetworks.has(networkId)) {
            this.loadUserBlockchainData();
        } else {
            this.showNotification('Unsupported network. Please switch to a supported network.', 'warning');
        }
    }
    
    disconnectWallet() {
        this.connectedAccount = null;
        this.provider = null;
        this.signer = null;
        
        localStorage.removeItem('connectedWallet');
        localStorage.removeItem('connectedAccount');
        
        this.updateConnectionStatus(false);
        this.showNotification('Wallet disconnected', 'info');
    }
    
    async loadUserBlockchainData() {
        if (!this.connectedAccount) return;
        
        try {
            // Load user's token balances
            const balances = await this.getUserTokenBalances();
            
            // Load user's NFTs
            const nfts = await this.getUserNFTs();
            
            // Load transaction history
            const transactions = await this.getTransactionHistory();
            
            // Update UI with user data
            this.updateUserBlockchainUI({ balances, nfts, transactions });
            
        } catch (error) {
            console.error('Failed to load blockchain data:', error);
        }
    }
    
    async getUserTokenBalances() {
        if (!this.provider) return {};
        
        try {
            const balance = await this.provider.getBalance(this.connectedAccount);
            const ethBalance = ethers.utils.formatEther(balance);
            
            return {
                ETH: ethBalance,
                // Add other token balances here
            };
        } catch (error) {
            console.error('Failed to get token balances:', error);
            return {};
        }
    }
    
    async getUserNFTs() {
        // Mock NFT data - in real implementation, this would query NFT contracts
        return [
            {
                id: 1,
                name: 'ShopVerse Genesis #001',
                image: 'https://via.placeholder.com/200x200/667eea/ffffff?text=NFT+1',
                collection: 'ShopVerse Genesis',
                tokenId: '1'
            },
            {
                id: 2,
                name: 'ShopVerse Genesis #027',
                image: 'https://via.placeholder.com/200x200/764ba2/ffffff?text=NFT+2',
                collection: 'ShopVerse Genesis',
                tokenId: '27'
            }
        ];
    }
    
    async getTransactionHistory() {
        // Mock transaction data
        return [
            {
                hash: '0x1234...5678',
                type: 'NFT Purchase',
                amount: '0.1 ETH',
                status: 'confirmed',
                timestamp: new Date()
            },
            {
                hash: '0x5678...9012',
                type: 'Token Transfer',
                amount: '100 USDC',
                status: 'confirmed',
                timestamp: new Date(Date.now() - 86400000)
            }
        ];
    }
    
    updateUserBlockchainUI(data) {
        // Update NFT collection count
        const nftCountElement = document.querySelector('.nft-collection .count');
        if (nftCountElement) {
            nftCountElement.textContent = data.nfts.length;
        }
        
        // Update user balance display (if exists)
        const balanceDisplay = document.getElementById('userBalance');
        if (balanceDisplay && data.balances.ETH) {
            balanceDisplay.textContent = `${parseFloat(data.balances.ETH).toFixed(4)} ETH`;
        }
    }
    
    // NFT Features
    async mintNFT(metadata) {
        if (!this.signer) {
            throw new Error('Wallet not connected');
        }
        
        try {
            // Mock NFT minting
            const transaction = {
                to: '0x742d35Cc6634C0532925a3b8D465C59E71cd4b72', // Mock NFT contract
                value: ethers.utils.parseEther('0.01'), // Minting fee
                gasLimit: 100000
            };
            
            const tx = await this.signer.sendTransaction(transaction);
            
            return {
                transactionHash: tx.hash,
                tokenId: Math.floor(Math.random() * 10000),
                contractAddress: transaction.to,
                metadata: metadata
            };
        } catch (error) {
            throw new Error(`NFT minting failed: ${error.message}`);
        }
    }
    
    async verifyNFTOwnership(contractAddress, tokenId) {
        if (!this.provider || !this.connectedAccount) {
            return false;
        }
        
        try {
            // Mock NFT ownership verification
            // In real implementation, this would call the NFT contract's ownerOf function
            const mockOwnership = Math.random() > 0.5; // 50% chance of ownership
            return mockOwnership;
        } catch (error) {
            console.error('NFT ownership verification failed:', error);
            return false;
        }
    }
    
    // Cryptocurrency Payment Features
    async processPayment(amount, currency, recipientAddress) {
        if (!this.signer) {
            throw new Error('Wallet not connected');
        }
        
        try {
            let transaction;
            
            if (currency === 'ETH') {
                transaction = {
                    to: recipientAddress,
                    value: ethers.utils.parseEther(amount.toString()),
                    gasLimit: 21000
                };
            } else {
                // For ERC-20 tokens, would need contract interaction
                throw new Error('ERC-20 payments not implemented in this demo');
            }
            
            const tx = await this.signer.sendTransaction(transaction);
            
            return {
                transactionHash: tx.hash,
                status: 'pending',
                amount: amount,
                currency: currency
            };
        } catch (error) {
            throw new Error(`Payment failed: ${error.message}`);
        }
    }
    
    async setupDeFiSubscription(planId, amount, interval) {
        if (!this.signer) {
            throw new Error('Wallet not connected');
        }
        
        try {
            // Mock DeFi subscription setup
            const subscriptionData = {
                planId: planId,
                amount: amount,
                interval: interval,
                subscriber: this.connectedAccount,
                startTime: Math.floor(Date.now() / 1000),
                contractAddress: '0x' + '0'.repeat(40) // Mock contract address
            };
            
            // In real implementation, this would interact with a subscription smart contract
            console.log('Setting up DeFi subscription:', subscriptionData);
            
            return {
                subscriptionId: 'sub_' + Math.random().toString(36).substr(2, 9),
                ...subscriptionData
            };
        } catch (error) {
            throw new Error(`DeFi subscription setup failed: ${error.message}`);
        }
    }
    
    // Demo Handlers
    async handleBlockchainDemo(demoType) {
        try {
            switch (demoType) {
                case 'nft-minting':
                    await this.demoNFTMinting();
                    break;
                case 'crypto-payments':
                    await this.demoCryptoPayment();
                    break;
                case 'defi-subscriptions':
                    await this.demoDeFiSubscription();
                    break;
                case 'ipfs-storage':
                    await this.demoIPFSStorage();
                    break;
                case 'wallet-integration':
                    this.showWalletModal();
                    break;
                default:
                    console.log('Demo type not implemented:', demoType);
            }
        } catch (error) {
            console.error('Demo failed:', error);
            this.showNotification(error.message, 'error');
        }
    }
    
    async demoNFTMinting() {
        if (!this.connectedAccount) {
            this.showNotification('Please connect your wallet first', 'warning');
            return;
        }
        
        const metadata = {
            name: 'ShopVerse Demo NFT',
            description: 'A demo NFT minted on the ShopVerse platform',
            image: 'https://via.placeholder.com/500x500/667eea/ffffff?text=Demo+NFT',
            attributes: [
                { trait_type: 'Rarity', value: 'Common' },
                { trait_type: 'Category', value: 'Demo' }
            ]
        };
        
        try {
            this.showNotification('Minting NFT...', 'info');
            const result = await this.mintNFT(metadata);
            this.showNotification(`NFT minted successfully! Token ID: ${result.tokenId}`, 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }
    
    async demoCryptoPayment() {
        if (!this.connectedAccount) {
            this.showNotification('Please connect your wallet first', 'warning');
            return;
        }
        
        try {
            this.showNotification('Processing payment...', 'info');
            const result = await this.processPayment(0.001, 'ETH', '0x742d35Cc6634C0532925a3b8D465C59E71cd4b72');
            this.showNotification(`Payment successful! TX: ${result.transactionHash}`, 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }
    
    async demoDeFiSubscription() {
        if (!this.connectedAccount) {
            this.showNotification('Please connect your wallet first', 'warning');
            return;
        }
        
        try {
            this.showNotification('Setting up DeFi subscription...', 'info');
            const result = await this.setupDeFiSubscription('premium', 10, 'monthly');
            this.showNotification(`DeFi subscription created! ID: ${result.subscriptionId}`, 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }
    
    async demoIPFSStorage() {
        this.showNotification('IPFS storage demo - Feature coming soon!', 'info');
    }
    
    // Crypto Price Updates
    startCryptoPriceUpdates() {
        // Mock price updates
        this.updateCryptoPrices();
        setInterval(() => this.updateCryptoPrices(), 30000); // Update every 30 seconds
    }
    
    updateCryptoPrices() {
        const prices = {
            btc: { price: 43250 + (Math.random() - 0.5) * 1000, change: (Math.random() - 0.5) * 10 },
            eth: { price: 2650 + (Math.random() - 0.5) * 100, change: (Math.random() - 0.5) * 8 },
            usdc: { price: 1.00, change: 0 },
            matic: { price: 0.85 + (Math.random() - 0.5) * 0.1, change: (Math.random() - 0.5) * 5 }
        };
        
        Object.entries(prices).forEach(([crypto, data]) => {
            const priceElement = document.getElementById(`${crypto}-price`);
            const changeElement = document.getElementById(`${crypto}-change`);
            
            if (priceElement) {
                priceElement.textContent = `$${data.price.toFixed(2)}`;
            }
            
            if (changeElement) {
                const changePercent = data.change.toFixed(1);
                changeElement.textContent = `${changePercent >= 0 ? '+' : ''}${changePercent}%`;
                
                changeElement.className = 'crypto-change';
                if (data.change > 0) {
                    changeElement.classList.add('positive');
                } else if (data.change < 0) {
                    changeElement.classList.add('negative');
                } else {
                    changeElement.classList.add('neutral');
                }
            }
        });
    }
    
    showNotification(message, type = 'info') {
        // Use existing notification system
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
    
    // Utility Methods
    async getGasPrices() {
        if (!this.provider) return null;
        
        try {
            const gasPrice = await this.provider.getGasPrice();
            return {
                standard: gasPrice,
                fast: gasPrice.mul(120).div(100), // 20% higher
                instant: gasPrice.mul(150).div(100) // 50% higher
            };
        } catch (error) {
            console.error('Failed to get gas prices:', error);
            return null;
        }
    }
    
    async estimateGas(transaction) {
        if (!this.provider) return null;
        
        try {
            const gasEstimate = await this.provider.estimateGas(transaction);
            return gasEstimate;
        } catch (error) {
            console.error('Failed to estimate gas:', error);
            return null;
        }
    }
    
    // Auto-reconnect on page load
    async autoReconnect() {
        const savedWallet = localStorage.getItem('connectedWallet');
        const savedAccount = localStorage.getItem('connectedAccount');
        
        if (savedWallet && savedAccount) {
            try {
                await this.connectWallet(savedWallet);
            } catch (error) {
                console.error('Auto-reconnect failed:', error);
                localStorage.removeItem('connectedWallet');
                localStorage.removeItem('connectedAccount');
            }
        }
    }
}

// Initialize Blockchain Features
const blockchainFeatures = new BlockchainFeatures();

// Auto-reconnect on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => blockchainFeatures.autoReconnect(), 1000);
});

// Export for global access
window.BlockchainFeatures = blockchainFeatures;