const main = async () => {
    // hre = object containing all the functionality that Hardhat exposes when running a task, test or script. The HardHat Runtime Environment
    const gameContractFactory = await hre.ethers.getContractFactory('NFTGame'); // compile contract & generate necessary files for artifacts directory
    const gameContract = await gameContractFactory.deploy(
        ["MightyChondria", "IcedCovfefe", "TransPride", "CriticalRaceTheory", "Textbook"],  // Names
        ["https://imgur.com/URVzM6G",                                                       // Images
            "https://imgur.com/aLpdKSd",
            "https://imgur.com/uzLZdBK",
            "https://imgur.com/m9Vvz0i",
            "https://images.app.goo.gl/TABGKymF8j73aass7"],
        [100, 200, 300, 300, 500],                                                          // HP values
        [40, 90, 120, 200, 400],                                                            // attack damage values
        "Mackayleigh Karen",                                             // Boss name
        "https://images.app.goo.gl/4N3Xr1eo4rQkNLet7",                                      // Boss image
        10000,                                                                              // Boss HP
        20                                                                                  // Boss attack damage
    );
    // HardHat generates local ETH network for this contract - each run is a fresh blockchain. Clean slate allows for easier debug.
    await gameContract.deployed(); // wait until contract is mined and deployed to local blockchain to run constructor
    console.log("Contract deployed to:", gameContract.address); // gives address of contracts on blockchain

    let txn;
    // We only have three characters.
    // an NFT w/ the character at index 2 of our array.
    txn = await gameContract.mintCharacterNFT(2);
    await txn.wait();

    txn = await gameContract.attackBoss();
    await txn.wait();

    txn = await gameContract.attackBoss();
    await txn.wait();

    // Get the value of the NFT's URI.
    let returnedTokenUri = await gameContract.tokenURI(1); // tokenURI function inherited from ERC721
    console.log("Token URI:", returnedTokenUri);
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