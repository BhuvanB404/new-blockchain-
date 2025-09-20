/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const {Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration for Org2
        const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca.org2.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get('Laboratory01');
        if (userIdentity) {
            console.log('An identity for the user "Laboratory01" already exists in the wallet');
            return;
        }

        // Check to see if we've already enrolled the labAdmin user.
        const adminIdentity = await wallet.get('labAdmin');
        if (!adminIdentity) {
            console.log('An identity for the labAdmin user "labAdmin" does not exist in the wallet');
            console.log('Run the ayurveda_admin_org2.js application before retrying');
            return;
        }

        // build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'labAdmin');

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            affiliation: 'org2.department1',
            enrollmentID: 'Laboratory01',
            role: 'client',
            attrs: [
                { name: 'role', value: 'laboratory', ecert: true },
                { name: 'uuid', value: 'Laboratory01', ecert: true }
            ],
        }, adminUser);
        
        const enrollment = await ca.enroll({
            enrollmentID: 'Laboratory01',
            enrollmentSecret: secret,
            attr_reqs: [
                { name: "role", optional: false },
                { name: "uuid", optional: false }
            ]
        });
        
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org2MSP',
            type: 'X.509',
        };
        await wallet.put('Laboratory01', x509Identity);
        console.log('Successfully registered and enrolled laboratory user "Laboratory01" and imported it into the wallet');
    } catch (error) {
        console.error(`Failed to register user "Laboratory01": ${error}`);
        process.exit(1);
    }
}

main();