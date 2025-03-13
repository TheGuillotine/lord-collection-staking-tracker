import { Staker, FilterOptions } from '../types';

/**
 * Format a wallet address to be displayed in the UI
 * Returns the first 6 and last 4 characters with ellipsis in between
 */
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Format a duration in seconds to a readable format
 * Returns days, hours, minutes
 */
export const formatDuration = (seconds: number): string => {
  const days = Math.floor(seconds / (60 * 60 * 24));
  const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
};

/**
 * Get the average staking duration in days
 */
export const getAverageDuration = (stakers: Staker[]): number => {
  if (stakers.length === 0) return 0;
  
  let totalNFTs = 0;
  let totalDuration = 0;
  
  for (const staker of stakers) {
    totalNFTs += staker.totalNFTs;
    totalDuration += staker.totalDuration;
  }
  
  if (totalNFTs === 0) return 0;
  
  // Convert to days and round to 1 decimal place
  return Math.round((totalDuration / totalNFTs) / (60 * 60 * 24) * 10) / 10;
};

/**
 * Filter stakers based on the filter options
 */
export const filterStakers = (stakers: Staker[], options: FilterOptions): Staker[] => {
  let filteredStakers = [...stakers];
  
  // Filter by NFT type
  if (options.nftType !== 'all') {
    filteredStakers = filteredStakers.filter(staker => 
      staker.nftTypes.has(options.nftType)
    );
  }
  
  // Filter by minimum duration (in days)
  if (options.minDuration > 0) {
    const minDurationSeconds = options.minDuration * 24 * 60 * 60;
    filteredStakers = filteredStakers.filter(staker => 
      staker.totalDuration >= minDurationSeconds
    );
  }
  
  // Sort stakers based on sort option
  switch (options.sortBy) {
    case 'duration-desc':
      filteredStakers.sort((a, b) => b.totalDuration - a.totalDuration);
      break;
    case 'duration-asc':
      filteredStakers.sort((a, b) => a.totalDuration - b.totalDuration);
      break;
    case 'count-desc':
      filteredStakers.sort((a, b) => b.totalNFTs - a.totalNFTs);
      break;
    case 'count-asc':
      filteredStakers.sort((a, b) => a.totalNFTs - b.totalNFTs);
      break;
  }
  
  return filteredStakers;
};

/**
 * Format NFT types as a comma-separated string
 */
export const formatNFTTypes = (types: Set<string>): string => {
  return Array.from(types).join(', ');
};

/**
 * Create a table row for a staker
 */
export const createStakerRow = (staker: Staker): HTMLTableRowElement => {
  const row = document.createElement('tr');
  
  // Address cell
  const addressCell = document.createElement('td');
  addressCell.innerText = formatAddress(staker.address);
  addressCell.title = staker.address; // Show full address on hover
  
  // NFT Types cell
  const typesCell = document.createElement('td');
  typesCell.innerText = formatNFTTypes(staker.nftTypes);
  
  // Total NFTs cell
  const totalNFTsCell = document.createElement('td');
  totalNFTsCell.innerText = staker.totalNFTs.toString();
  
  // Total Duration cell
  const durationCell = document.createElement('td');
  // Convert seconds to days for display
  const durationDays = Math.round(staker.totalDuration / (60 * 60 * 24) * 10) / 10;
  durationCell.innerText = `${durationDays} days`;
  
  // Add cells to row
  row.appendChild(addressCell);
  row.appendChild(typesCell);
  row.appendChild(totalNFTsCell);
  row.appendChild(durationCell);
  
  return row;
};

/**
 * Display loading state in the UI
 */
export const showLoading = (show: boolean): void => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = show ? 'block' : 'none';
  }
};

/**
 * Display error message in the UI
 */
export const showError = (message: string | null): void => {
  const errorElement = document.getElementById('error-message');
  if (errorElement) {
    if (message) {
      errorElement.innerText = message;
      errorElement.style.display = 'block';
    } else {
      errorElement.style.display = 'none';
    }
  }
};

/**
 * Clear all rows from the stakers table
 */
export const clearStakersTable = (): void => {
  const tableBody = document.getElementById('stakers-list');
  if (tableBody) {
    tableBody.innerHTML = '';
  }
};

/**
 * Update the pagination UI
 */
export const updatePagination = (
  currentPage: number, 
  totalPages: number, 
  hasNextPage: boolean, 
  hasPrevPage: boolean
): void => {
  const prevButton = document.getElementById('prev-page') as HTMLButtonElement;
  const nextButton = document.getElementById('next-page') as HTMLButtonElement;
  const pageInfo = document.getElementById('page-info');
  
  if (prevButton) {
    prevButton.disabled = !hasPrevPage;
  }
  
  if (nextButton) {
    nextButton.disabled = !hasNextPage;
  }
  
  if (pageInfo) {
    pageInfo.innerText = `Page ${currentPage} of ${totalPages || 1}`;
  }
};
