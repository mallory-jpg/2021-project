const main = async () => {
    // hre = object containing all the functionality that Hardhat exposes when running a task, test or script. The HardHat Runtime Environment
    const gameContractFactory = await hre.ethers.getContractFactory('NFTGame'); // compile contract & generate necessary files for artifacts directory
    const gameContract = await gameContractFactory.deploy(
        ["MightyChondria", "IcedCovfefe", "TransPride", "CriticalRaceTheory", "Textbook"],  // Names
        ["https://i.imgur.com/URVzM6G.png",                                           // Images
            "https://i.imgur.com/aLpdKSd.jpeg",
            "https://i.imgur.com/uzLZdBK.jpeg",
            "https://i.imgur.com/m9Vvz0i.jpeg",
            "https://media.wired.com/photos/5926f79caf95806129f51367/master/pass/GettyImages-532456845.jpg"],
        [100, 200, 300, 300, 500],                                                        // HP values
        [40, 90, 120, 200, 400],                                                           // attack damage values
         "Mackayleigh Karen",                                             // Boss name
        "https://i.kym-cdn.com/entries/icons/original/000/018/181/managerhaircutt.jpg",                                      // Boss image
        10000,                                                                              // Boss HP
        20                                                                                  // Boss attack damage
    );
    
    // HardHat generates local ETH network for this contract - each run is a fresh blockchain. Clean slate allows for easier debug.
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