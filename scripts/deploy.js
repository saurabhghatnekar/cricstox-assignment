const hre = require("hardhat");
const {ethers} = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    const FixedMath = await ethers.getContractFactory("FixedMath");
    const FixedMathInstance = await FixedMath.deploy();
    console.log("FixedMath deployed to", FixedMathInstance.address);
    const SigmoidAmm = await ethers.getContractFactory("SigmoidAmm", {
        libraries: {
            FixedMath: FixedMathInstance.address,
        },
    });

    const DAI = await ethers.getContractFactory("DAI");

    const DaiInstance = await DAI.deploy();
    console.log("DAI deployed to", DaiInstance.address);
    let SigmoidAmmInstance = await SigmoidAmm.deploy(DaiInstance.address);

    console.log("SigmoidAmm deployed to", SigmoidAmmInstance.address);

    // saveFrontendFiles(sampleContract);

}

function saveFrontendFiles(contract) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../src/abis";

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
        contractsDir + "/contract-address.json",
        JSON.stringify({SampleContract: contract.address}, undefined, 2)
    );

    const SampleContractArtifact = artifacts.readArtifactSync("SampleContract");

    fs.writeFileSync(
        contractsDir + "/SampleContract.json",
        JSON.stringify(SampleContractArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });