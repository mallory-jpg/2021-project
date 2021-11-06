const main = async () => {
    // hre = object containing all the functionality that Hardhat exposes when running a task, test or script. The HardHat Runtime Environment
    const gameContractFactory = await hre.ethers.getContractFactory('NFTGame'); // compile contract & generate necessary files for artifacts directory
    const gameContract = await gameContractFactory.deploy(); // HardHat generates local ETH network for this contract - each run is a fresh blockchain. Clean slate allows for easier debug.
    await gameContract.deployed(); // wait until contract is mined and deployed to local blockchain to run constructor
    console.log("Contract deployed to:", gameContract.address); // gives address of contracts on blockchain
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();