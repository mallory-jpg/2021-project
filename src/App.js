import React, { useEffect, useState } from 'react';
import './App.css';
import NFTGame from './utils/NFTGame.json';
import Arena from './Components/Arena';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import SelectCharacter from './Components/SelectCharacter';
import twitterLogo from './assets/twitter-logo.svg';
import LoadingIndicator from './Components/LoadingIndicator';

// Constants
const TWITTER_HANDLE = 'culbert_mallory';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
    // State
    const [currentAccount, setCurrentAccount] = useState(null);
    const [characterNFT, setCharacterNFT] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Actions
    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log('Make sure you have MetaMask!');
                setIsLoading(false);
                return;
            } else {
                console.log('We have the ethereum object', ethereum);

                const accounts = await ethereum.request({ method: 'eth_accounts' });

                if (accounts.length !== 0) {
                    const account = accounts[0];
                    console.log('Found an authorized account:', account);
                    setCurrentAccount(account);
                } else {
                    console.log('No authorized account found');
                }
            }
        } catch (error) {
            console.log(error);
        }
        // release state property
        setIsLoading(false);
    };

    // Render Methods
    const renderContent = () => {
        // While loading, render out LoadingIndicator
        if (isLoading) {
            return <LoadingIndicator />;
        }
        /*
         * Scenario #1
         */
        if (!currentAccount) {
            return (
                <div className="connect-wallet-container">
                    <img
                        src="https://c.tenor.com/lufltc-TdiIAAAAC/karen-ok-karen.gif"
                        alt="Karen wants to speak to the manager"
                    />
                    <button
                        className="cta-button connect-wallet-button"
                        onClick={connectWalletAction}
                    >
                        Connect Wallet If *You* Are the Manager
                    </button>
                </div>
            );

        } else if (currentAccount && !characterNFT) {
            return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
            // If user has characterNFT & a connected wallet -> we #fighting!
        } else if (currentAccount && characterNFT) {
            return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />;
        }
    };

    /*
     * Implement your connectWallet method here
     */
    const connectWalletAction = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert('Get MetaMask!');
                return;
            }

            /*
             * Fancy method to request access to account.
             */
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });

            /*
             * Boom! This should print out public address once we authorize Metamask.
             */
            console.log('Connected', accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        checkIfWalletIsConnected();
    }, []);

    useEffect(() => {
        /*
         * Function call that interacts with our smart contract.
         * Declaring async function to run inside hook this way because async & useEffect conflict otherwise
         */
        const fetchNFTMetadata = async () => {
            console.log('Checking for Character NFT on address:', currentAccount);
            // main logic for contract call and setup of Ethers object
            const provider = new ethers.providers.Web3Provider(window.ethereum); // communicate with Ethereum nodes using Provider
            const signer = provider.getSigner(); // signer sign messages & transactions & send to ETH network to execute state-changin operations 
            // create contract object
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                NFTGame.abi,
                signer
            );

            const txn = await gameContract.checkIfUserHasNFT();
            if (txn.name) {
                console.log('User has character NFT');
                setCharacterNFT(transformCharacterData(txn));
            } else {
                console.log('No character NFT found');
            }
            setIsLoading(false);
        };

        /*
         * Only runs if wallet is connected
         */
        if (currentAccount) {
            console.log('CurrentAccount:', currentAccount);
            fetchNFTMetadata();
        }
    }, [currentAccount]); // currentAccount = user's public wallet address

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header gradient-text">?????? The 2021 Project ??????</p>
                    <p className="sub-text">Fight for The Culture!</p>
                    {renderContent()}
                </div>
                <div className="footer-container">
                    <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
                    <a
                        className="footer-text"
                        href={TWITTER_LINK}
                        target="_blank"
                        rel="noreferrer"
                    >{`built by @${TWITTER_HANDLE} with @_buildspace`}</a>
                </div>
            </div>
        </div>
    );
};

export default App;