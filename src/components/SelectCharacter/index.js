import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import NFTGame from '../../utils/NFTGame.json';

const SelectCharacter = ({ setCharacterNFT }) => {
    const [characters, setCharacters] = useState([]);
    const [gameContract, setGameContract] = useState(null);

    // Render Methods
    const renderCharacters = () =>
        characters.map((character, index) => (
            <div className="character-item" key={character.name}>
                <div className="name-container">
                    <p>{character.name}</p>
                </div>
                <img src={character.imageURI} alt={character.name} />
                <button
                    type="button"
                    className="character-mint-button"
                    onClick={mintCharacterNFTAction(index)}
                >{`Mint ${character.name}`}</button>
            </div>
        ));

    // UseEffect
    useEffect(() => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                NFTGame.abi,
                signer
            );

            setGameContract(gameContract);
        } else {
            console.log('Ethereum object not found');
        }

    }, []);

    // Actions
    const mintCharacterNFTAction = (characterId) => async () => {
        try {
            if (gameContract) {
                console.log('Minting character in progress...');
                const mintTxn = await gameContract.mintCharacterNFT(characterId);
                await mintTxn.wait();
                console.log('mintTxn:', mintTxn);
            }
        } catch (error) {
            console.warn('MintCharacterAction Error:', error);
        }

    };

    useEffect(() => {
        const getCharacters = async () => {
            try {
                console.log('Getting contract characters to mint');

                const charactersTxn = await gameContract.getAllDefaultCharacters();
                console.log('charactersTxn:', charactersTxn);
                const characters = charactersTxn.map((characterData) =>
                    transformCharacterData(characterData)
                );

                setCharacters(characters);
            } catch (error) {
                console.error('Something went wrong fetching characters:', error);
            }
        };
        const onCharacterMint = async (sender, tokenId, characterIndex) => {
            console.log(
                `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
            );


            if (gameContract) {
                const characterNFT = await gameContract.checkIfUserHasNFT();
                console.log('CharacterNFT: ', characterNFT);
                setCharacterNFT(transformCharacterData(characterNFT));
            }
        };

        if (gameContract) {
            getCharacters();
            gameContract.on('CharacterNFTMinted', onCharacterMint);
            // alert(`Your NFT is all done -- see it here: https://testnets.opensea.io/assets/${gameContract}/${tokenId.toNumber()}`);
        }
        return () => {
            if (gameContract) {
                gameContract.off('CharacterNFTMinted', onCharacterMint);
            }
        };
    }, [gameContract]);

    return (
        <div className="select-character-container">
            <h2>Mint Your Hero. Save El Barrio.</h2>
            {characters.length > 0 && (
                <div className="character-grid">{renderCharacters()}</div>
            )}
        </div>
    );
};



export default SelectCharacter;

