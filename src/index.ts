import { BlockchainService } from './services/blockchain.service';
import {
  showLoading,
  showError,
  clearStakersTable,
  createStakerRow,
  filterStakers,
  updatePagination,
  getAverageDuration
} from './utils/ui.utils';
import { Staker, FilterOptions } from './types';

// Initialize the Blockchain Service
const blockchainService = new BlockchainService();

// State variables
let allStakers: Staker[] = [];
let filteredStakers: Staker[] = [];
let currentPage = 1;
const pageSize = 10;
let nftTypes: string[] = [];

// Default filter options
const filterOptions: FilterOptions = {
  nftType: 'all',
  minDuration: 0,
  sortBy: 'duration-desc'
};

/**
 * Initialize the application
 */
async function initApp() {
  try {
    // Show loading state
    showLoading(true);
    showError(null);
    
    // Get all NFT types and populate the filter dropdown
    await loadNFTTypes();
    
    // Load initial data
    await loadStakersData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Hide loading state
    showLoading(false);
  } catch (error) {
    console.error('Error initializing app:', error);
    showLoading(false);
    showError('Failed to initialize the application. Please refresh the page and try again.');
  }
}

/**
 * Load NFT types from the blockchain
 */
async function loadNFTTypes() {
  try {
    nftTypes = await blockchainService.getNFTTypes();
    
    // Populate the NFT type dropdown
    const nftTypeSelect = document.getElementById('nft-type') as HTMLSelectElement;
    if (nftTypeSelect) {
      // Add default "All Types" option
      const defaultOption = document.createElement('option');
      defaultOption.value = 'all';
      defaultOption.text = 'All Types';
      nftTypeSelect.appendChild(defaultOption);
      
      // Add all available NFT types
      nftTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.text = type;
        nftTypeSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error loading NFT types:', error);
    throw error;
  }
}

/**
 * Load stakers data from the blockchain
 */
async function loadStakersData() {
  try {
    showLoading(true);
    showError(null);
    
    // Get all stakers with their NFT details
    allStakers = await blockchainService.getAllStakersWithDetails();
    
    // Apply current filters
    applyFilters();
    
    // Update summary statistics
    updateSummaryStats();
    
    showLoading(false);
  } catch (error) {
    console.error('Error loading stakers data:', error);
    showLoading(false);
    showError('Failed to load stakers data from the blockchain. Please try again later.');
    throw error;
  }
}

/**
 * Apply filters to the stakers data
 */
function applyFilters() {
  try {
    // Apply filters to the data
    filteredStakers = filterStakers(allStakers, filterOptions);
    
    // Reset to page 1 when filters change
    currentPage = 1;
    
    // Render the current page
    renderCurrentPage();
  } catch (error) {
    console.error('Error applying filters:', error);
    showError('Failed to apply filters. Please try again.');
  }
}

/**
 * Render the current page of stakers
 */
function renderCurrentPage() {
  try {
    // Clear the current table
    clearStakersTable();
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredStakers.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredStakers.length);
    
    // Get stakers for the current page
    const currentStakers = filteredStakers.slice(startIndex, endIndex);
    
    // Render each staker row
    const tableBody = document.getElementById('stakers-list');
    if (tableBody) {
      currentStakers.forEach(staker => {
        const row = createStakerRow(staker);
        tableBody.appendChild(row);
      });
      
      // If no stakers found
      if (currentStakers.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 4;
        emptyCell.innerText = 'No stakers found with the current filters';
        emptyCell.style.textAlign = 'center';
        emptyCell.style.padding = '20px';
        emptyRow.appendChild(emptyCell);
        tableBody.appendChild(emptyRow);
      }
    }
    
    // Update pagination controls
    updatePagination(
      currentPage,
      totalPages,
      currentPage < totalPages,
      currentPage > 1
    );
  } catch (error) {
    console.error('Error rendering page:', error);
    showError('Failed to render stakers data. Please try again.');
  }
}

/**
 * Update summary statistics in the UI
 */
function updateSummaryStats() {
  try {
    // Update total unique stakers
    const uniqueStakersElem = document.getElementById('unique-stakers');
    if (uniqueStakersElem) {
      uniqueStakersElem.innerText = allStakers.length.toString();
    }
    
    // Update total NFTs staked
    const totalNftsElem = document.getElementById('total-nfts');
    if (totalNftsElem) {
      const totalNFTs = allStakers.reduce((sum, staker) => sum + staker.totalNFTs, 0);
      totalNftsElem.innerText = totalNFTs.toString();
    }
    
    // Update average duration
    const avgDurationElem = document.getElementById('avg-duration');
    if (avgDurationElem) {
      const avgDuration = getAverageDuration(allStakers);
      avgDurationElem.innerText = avgDuration.toString();
    }
  } catch (error) {
    console.error('Error updating summary stats:', error);
  }
}

/**
 * Set up event listeners for UI controls
 */
function setupEventListeners() {
  // Apply Filters button
  const applyFiltersBtn = document.getElementById('apply-filters');
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
      // Get filter values from the UI
      const nftTypeSelect = document.getElementById('nft-type') as HTMLSelectElement;
      const minDurationInput = document.getElementById('min-duration') as HTMLInputElement;
      const sortBySelect = document.getElementById('sort-by') as HTMLSelectElement;
      
      // Update filter options
      filterOptions.nftType = nftTypeSelect?.value || 'all';
      filterOptions.minDuration = parseInt(minDurationInput?.value || '0');
      filterOptions.sortBy = (sortBySelect?.value || 'duration-desc') as 'duration-desc' | 'duration-asc' | 'count-desc' | 'count-asc';
      
      // Apply the updated filters
      applyFilters();
    });
  }
  
  // Pagination: Previous Page button
  const prevPageBtn = document.getElementById('prev-page');
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderCurrentPage();
      }
    });
  }
  
  // Pagination: Next Page button
  const nextPageBtn = document.getElementById('next-page');
  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredStakers.length / pageSize);
      if (currentPage < totalPages) {
        currentPage++;
        renderCurrentPage();
      }
    });
  }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
