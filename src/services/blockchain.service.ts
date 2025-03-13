import { ethers } from 'ethers';
import { Staker, StakedNFT, StakingContractABI } from '../types';

export class BlockchainService {
  private provider: ethers.providers.JsonRpcProvider;
  private stakingContract: ethers.Contract;
  private contractAddress: string = '0xfb597d6fa6c08f5434e6ecf69114497343ae13dd';

  constructor() {
    // Ronin blockchain RPC URL - using the public Ronin RPC endpoint
    const roninRpcUrl = 'https://api.roninchain.com/rpc';
    this.provider = new ethers.providers.JsonRpcProvider(roninRpcUrl);
    this.stakingContract = new ethers.Contract(
      this.contractAddress,
      StakingContractABI,
      this.provider
    );
  }

  /**
   * Get the total number of unique stakers
   */
  public async getTotalStakers(): Promise<number> {
    try {
      const totalStakers = await this.stakingContract.getTotalStakers();
      return totalStakers.toNumber();
    } catch (error) {
      console.error('Error getting total stakers:', error);
      throw error;
    }
  }

  /**
   * Get the total number of staked NFTs
   */
  public async getTotalStakedNFTs(): Promise<number> {
    try {
      const totalNFTs = await this.stakingContract.getTotalStakedNFTs();
      return totalNFTs.toNumber();
    } catch (error) {
      console.error('Error getting total staked NFTs:', error);
      throw error;
    }
  }

  /**
   * Get all available NFT types
   */
  public async getNFTTypes(): Promise<string[]> {
    try {
      const types = await this.stakingContract.getAvailableNFTTypes();
      return types;
    } catch (error) {
      console.error('Error getting NFT types:', error);
      throw error;
    }
  }

  /**
   * Get a paginated list of staker addresses
   */
  public async getStakerAddresses(page: number, limit: number): Promise<string[]> {
    try {
      const addresses = await this.stakingContract.getStakers(page, limit);
      return addresses;
    } catch (error) {
      console.error('Error getting staker addresses:', error);
      throw error;
    }
  }

  /**
   * Get detailed information about a staker's NFTs
   */
  public async getStakerNFTs(address: string): Promise<StakedNFT[]> {
    try {
      const [tokenIds, tokenTypes, stakeTimes] = await this.stakingContract.getStakedNFTs(address);
      
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      const nfts: StakedNFT[] = [];
      
      for (let i = 0; i < tokenIds.length; i++) {
        const stakeTime = stakeTimes[i].toNumber();
        const stakeDuration = now - stakeTime; // Duration in seconds
        
        nfts.push({
          tokenId: tokenIds[i].toNumber(),
          tokenType: tokenTypes[i],
          stakeTime: stakeTime,
          stakeDuration: stakeDuration
        });
      }
      
      return nfts;
    } catch (error) {
      console.error(`Error getting staked NFTs for address ${address}:`, error);
      throw error;
    }
  }

  /**
   * Get detailed information about all stakers, including their NFTs
   */
  public async getAllStakersWithDetails(pageSize: number = 10): Promise<Staker[]> {
    try {
      const totalStakers = await this.getTotalStakers();
      const totalPages = Math.ceil(totalStakers / pageSize);
      
      const allStakers: Staker[] = [];
      
      // Fetch stakers page by page to avoid overloading the RPC
      for (let page = 0; page < totalPages; page++) {
        const addresses = await this.getStakerAddresses(page, pageSize);
        
        for (const address of addresses) {
          const nfts = await this.getStakerNFTs(address);
          
          const totalDuration = nfts.reduce((sum, nft) => sum + nft.stakeDuration, 0);
          const nftTypes = new Set(nfts.map(nft => nft.tokenType));
          
          allStakers.push({
            address,
            nfts,
            totalNFTs: nfts.length,
            totalDuration: totalDuration,
            nftTypes
          });
        }
      }
      
      return allStakers;
    } catch (error) {
      console.error('Error getting all stakers with details:', error);
      throw error;
    }
  }

  /**
   * Calculate the average staking duration across all NFTs
   */
  public calculateAverageDuration(stakers: Staker[]): number {
    let totalNFTs = 0;
    let totalDuration = 0;
    
    for (const staker of stakers) {
      totalNFTs += staker.totalNFTs;
      totalDuration += staker.totalDuration;
    }
    
    if (totalNFTs === 0) return 0;
    
    // Return average in days (convert from seconds)
    return Math.round((totalDuration / totalNFTs) / (60 * 60 * 24));
  }
}
