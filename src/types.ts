// Define the staking data structure
export interface StakedNFT {
  tokenId: number;
  tokenType: string;
  stakeTime: number; // Timestamp when staked
  stakeDuration: number; // Duration in seconds
}

export interface Staker {
  address: string;
  nfts: StakedNFT[];
  totalNFTs: number;
  totalDuration: number; // Total duration in seconds
  nftTypes: Set<string>;
}

export interface FilterOptions {
  nftType: string;
  minDuration: number;
  sortBy: 'duration-desc' | 'duration-asc' | 'count-desc' | 'count-asc';
}

// Define the staking contract ABI (Application Binary Interface)
// This is a partial ABI with only the functions we need
export const StakingContractABI = [
  {
    "inputs": [],
    "name": "getTotalStakers",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalStakedNFTs",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_page", "type": "uint256"}, {"internalType": "uint256", "name": "_limit", "type": "uint256"}],
    "name": "getStakers",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_staker", "type": "address"}],
    "name": "getStakedNFTs",
    "outputs": [
      {"internalType": "uint256[]", "name": "tokenIds", "type": "uint256[]"},
      {"internalType": "string[]", "name": "tokenTypes", "type": "string[]"},
      {"internalType": "uint256[]", "name": "stakeTimes", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAvailableNFTTypes",
    "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
    "stateMutability": "view",
    "type": "function"
  }
];
