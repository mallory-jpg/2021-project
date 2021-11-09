import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import NFTGame from '../../utils/NFTGame.json';
import './Arena.css';
import LoadingIndicator from './Components/LoadingIndicator';

// pass in CharacterNFT data to see card in UI
// pass in setCharacterNFT?
const Arena = ({ characterNFT, setCharacterNFT }) => {
    // State
    const [gameContract, setGameContract] = useState(null);
    const [boss, setBoss] = useState(null);
    // const [characterNFT, setCharacterNFT] = useState(null);
    const [attackState, setAttackState] = useState('');
    const [showToast, setShowToast] = useState(false);

    const runAttackAction = async () => {
        // attack states: attack, hit, ' ' (default)
        try {
            if (gameContract) {
                setAttackState('attacking');                        // player hits boss at attack damage level
                console.log('Attacking boss...');
                const attackTxn = await gameContract.attackBoss();  // boss hits back with attack damage
                await attackTxn.wait();                             // UI won't update until transaction is mined
                console.log('attackTxn:', attackTxn);
                setAttackState('hit');
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 5000);
            }
        } catch (error) {
            console.error('Error attacking boss:', error);
            setAttackState('');
        }
    };

    // UseEffects
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

    useEffect(() => {
        // async function to get boss from contract & updates state
        const fetchBoss = async () => {
            const bossTxn = await gameContract.getBigBoss();
            console.log('Boss:', bossTxn);
            setBoss(transformCharacterData(bossTxn));
        };

        const onAttackComplete = (newBossHp, newPlayerHp) => {
            const bossHp = newBossHp.toNumber();
            const playerHp = newPlayerHp.toNumber();

            console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

            // Update player & boss HP
            setBoss((prevState) => {
                return { ...prevState, hp: bossHp };
            });

            setCharacterNFT((prevState) => {
                return { ...prevState, hp: playerHp };
            });
        };

        if (gameContract) {
            // fetch Boss if there's a gaming contract
            fetchBoss();
            gameContract.on('AttackComplete', onAttackComplete);
        }
        // clean
        return () => {
            if (gameContract) {
                gameContract.off('AttackComplete', onAttackComplete);
            }
        }
    }, [gameContract]);

    return (
        <div className="arena-container">
            {boss && characterNFT && (
                <div id="toast" className={showToast ? 'show' : ''}>
                    <div id="desc">{`💥 ${boss.name} was hit for ${characterNFT.attackDamage}!`}</div>
                </div>
            )}

            {boss && (
                <div className="boss-container">
                    {/* AttackState part of className! */}
                    <div className={`boss-content ${attackState}`}>
                        <h2>🔥 {boss.name} 🔥</h2>
                        <div className="image-content">
                            <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
                            <div className="health-bar">
                                <progress value={boss.hp} max={boss.maxHp} />
                                <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
                            </div>
                        </div>
                    </div>
                    <div className="attack-container">
                        <button className="cta-button" onClick={runAttackAction}>
                            {`💥 Attack ${boss.name}`}
                        </button>
                    </div>
                    {attackState === 'attacking' && (
                        <div className="loading-indicator">
                            <LoadingIndicator />
                            <p>Attacking ⚔️</p>
                        </div>
                    )}
                </div>
            )}

            {characterNFT && (
                <div className="players-container">
                    <div className="player-container">
                        <h2>Your Character</h2>
                        <div className="player">
                            <div className="image-content">
                                <h2>{characterNFT.name}</h2>
                                <img
                                    src={characterNFT.imageURI}
                                    alt={`Character ${characterNFT.name}`}
                                />
                                <div className="health-bar">
                                    <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                                    <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                                </div>
                            </div>
                            <div className="stats">
                                <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
                            </div>
                        </div>
                    </div>
                    {/* <div className="active-players">
          <h2>Active Players</h2>
          <div className="players-list">{renderActivePlayersList()}</div>
        </div> */}
                </div>
            )}
        </div>
    );
};

export default Arena;