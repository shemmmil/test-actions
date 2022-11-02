// This is a script for deployment and automatically verification of all the contracts (`contracts/`)

const hre = require("hardhat");
const { ethers } = hre;
const { verify, getAddressSaver } = require("./utilities/helpers");
const path = require("path");

async function main() {
    /*
     * Hardhat always runs the compile task when running scripts with its command line interface.
     *
     * If this script is run directly using `node` you may want to call compile manually
     * to make sure everything is compiled.
     */
    // await hre.run("compile");

    const [deployer] = await ethers.getSigners();

    // Deployed contract address saving functionality
    const network = (await ethers.getDefaultProvider().getNetwork()).name; // Getting of the current network
    // Path for saving of addresses of deployed contracts
    const addressesPath = path.join(__dirname, "./deploymentAddresses.json");
    // The function to save an address of a deployed contract to the specified file and to output to console
    const saveAddress = getAddressSaver(addressesPath, network, true);

    // Deployment of the `contracts/2INCH.sol`
    const MyToken = (await ethers.getContractFactory("TwoInchToken")).connect(deployer);
    const name = "TwoInchToken",
        symbol = "2INCH";
    const capSupply = ethers.utils.parseEther("2000000000");
    const myToken = await MyToken.deploy(name, symbol, capSupply);
    await myToken.deployed();

    // Saving of an address of the deployed contract to the file
    saveAddress("TwoInchToken", myToken.address);

    console.log("Deployment is completed.");
}

// This pattern is recommended to be able to use async/await everywhere and properly handle errors
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
