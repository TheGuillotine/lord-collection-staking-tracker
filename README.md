# Lord Collection Staking Tracker

A web application to track stakers of the Lord Collection on the Ronin blockchain for the Wild Forest game.

## Features

- View unique stakers of the Lord Collection NFTs
- See what types of NFTs each wallet has staked
- Track total staking duration for each wallet
- Filter stakers by NFT type and minimum staking duration
- Sort results by duration or NFT count

## Technical Details

This application connects to the Ronin blockchain to query the staking contract at address `0xfb597d6fa6c08f5434e6ecf69114497343ae13dd`. It retrieves information about:

- Unique addresses that have staked Lord Collection NFTs
- The types of NFTs each address has staked
- The total duration of all staked NFTs per address

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone this repository:
```bash
git clone https://github.com/TheGuillotine/lord-collection-staking-tracker.git
cd lord-collection-staking-tracker
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Open your browser and navigate to `http://localhost:9000`

### Building for Production

To build the application for production deployment:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory, which you can deploy to any static hosting service.

## How It Works

1. The application connects to the Ronin blockchain using ethers.js
2. It calls the staking contract to retrieve all stakers and their staked NFTs
3. The data is processed and displayed in a user-friendly table
4. Users can filter and sort the data based on various criteria

## Technology Stack

- TypeScript
- ethers.js for blockchain interaction
- Webpack for building and bundling
- Modern ES6+ JavaScript

## Contract Interface

The application expects the staking contract to implement the following functions:

- `getTotalStakers()`: Returns the total number of unique stakers
- `getTotalStakedNFTs()`: Returns the total number of staked NFTs
- `getStakers(page, limit)`: Returns a paginated list of staker addresses
- `getStakedNFTs(staker)`: Returns details about the NFTs staked by a particular address
- `getAvailableNFTTypes()`: Returns a list of all available NFT types

## License

This project is licensed under the MIT License - see the LICENSE file for details.
