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
        const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        const ca = new FabricCAServices(caURL);

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const userIdentity = await wallet.get('Farmer01');
        if (userIdentity) {
            console.log('An identity for the user "Farmer01" already exists in the wallet');
            return;
        }

        const adminIdentity = await wallet.get('regulatorAdmin');
        if (!adminIdentity) {
            console.log('An identity for the regulatorAdmin user "regulatorAdmin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'regulatorAdmin');

        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: 'Farmer01',
            role: 'client',
            attrs: [
                { name: 'role', value: 'farmer', ecert: true },
                { name: 'uuid', value: 'Farmer01', ecert: true }
            ],
        }, adminUser);
        
        const enrollment = await ca.enroll({
            enrollmentID: 'Farmer01',
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
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put('Farmer01', x509Identity);
        console.log('Successfully registered and enrolled farmer user "Farmer01" and imported it into the wallet');
    } catch (error) {
        console.error(`Failed to register user "Farmer01": ${error}`);
        process.exit(1);
    }
}

main();
