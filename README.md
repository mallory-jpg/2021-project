# Into the Metaverse
Mint your hero in this turn-based NFT browser game.

## Overview
The game is based on Ethereum smart contracts (a piece of code that lives on the Ethereum blockchain). As its deployed to the blockchain, anyone in the world with a computer or smart phone can access it, run the smart contract, and play the game. The client website allows players to connect their Ethereum wallets and play the game!

The goal of the game is to **Unalive. The. Boss**. 🗡 ☠️ 🔪

* Players begin by minting a character NFT. Each minted character has a certain *HP* and *Attack Damage*.
* Players command their character to attack the Final Boss and inflict damage. Watch out: the Boss fights back!
* Each character NFT has its attributes (like HP, damage, etc.) stored directly as part of the NFT.
* An unlimited number of NFTs of each character can be minted
* Each NFT holds its own state
## How to Play
1. Connect your Ethereum wallet
2. Choose a character NFT to mint 
Each character has the following attributes:
* Image
* Name
* HP value
* Attack Damage value

### How to Win
Players must work together to attack the boss and kill it by draining its HP to 0. Moral of the story: we can't do this alone.

## Rules
* Each player can only have 1 NFT character in their wallet
* If a character's HP goes below zero, it dies >>> GAME OVER.
* Many players must work together to win!

## Development
### Dev Environment
Tools:
* Ethereum blockchain
* [buildspace](https://app.buildspace.so/courses/CO5cc2751b-e878-41c4-99fa-a614dc910ee9/lessons/LEc40235e7-8135-4e55-8b7c-6b17ffd15cbd)
* OpenSea or Rarible NFT marketplaces
* [HardHat](https://hardhat.org/tutorial/setting-up-the-environment.html)
* OpenZeppelin

To install HardHat (to compile and test smart contracts locally), you must have node/npm. After downloading & installing npm, create & move into the directory for your game, initialize npm, & install HardHat:
```
npm init -y
npm install --save-dev hardhat
```

### Staging & Testing Environment
* OpenSea TestNets
* MyCrypto ETH faucet
* Rinkeby TestNet & [TestNet Explorer](https://rinkeby.etherscan.io/)
* AlchemyAPI 
* MetaMask ETH wallet
