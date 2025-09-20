




'use strict';

const fs = require('fs');
const path = require('path');
const { Wallets, Gateway } = require('fabric-network');

const invokeTransaction = async (fcn, args, userID) => {
    const channelName = 'mychannel';
    const chaincodeName = 'ehrChainCode';

    // Determine which org the user belongs to based on userID and role
    let orgID = 'Org1';

    // Check if user belongs to Org2 (laboratories)
    if (userID.toLowerCase().includes('lab') ||
        userID === 'Laboratory01' ||
        userID === 'LabOverseer01' ||
        userID === 'labAdmin') {
        orgID = 'Org2';
    }

    try {
        const ccpPath = path.resolve(__dirname, '..', 'fabric-samples','test-network', 'organizations', 'peerOrganizations', `${orgID}.example.com`.toLowerCase(), `connection-${orgID}.json`.toLowerCase());
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const identity = await wallet.get(userID);
        if (!identity) {
            console.log(`An identity for the user ${userID} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return {
                statusCode: 400,
                status: false,
                message: `An identity for the user ${userID} does not exist.`
            };
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userID, discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);

        console.log(`Invoke arguments for ${fcn}:`, JSON.stringify(args));
        console.log(`Using organization: ${orgID} for user: ${userID}`);

        // Submit transaction with a single stringified JSON object
        let result = await contract.submitTransaction(fcn, JSON.stringify(args));

        console.log(`Response from ${fcn} chaincode: ${result.toString()}`);

        gateway.disconnect();

        // Try to parse result as JSON, if it fails return as string
        try {
            return JSON.parse(result.toString());
        } catch (e) {
            return {
                statusCode: 200,
                status: true,
                message: result.toString()
            };
        }

    } catch (error) {
        console.error(`Failed to invoke transaction ${fcn} for user ${userID}: ${error.message}`);
        return {
            statusCode: 500,
            status: false,
            message: `Failed to invoke transaction: ${error.message}`
        };
    }
}

module.exports = {
    invokeTransaction
};
