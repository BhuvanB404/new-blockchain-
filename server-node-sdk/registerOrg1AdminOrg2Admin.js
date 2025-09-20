// registerOrg1AdminOrg2Admin.js - FIXED and MERGED
'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

/**
 * Registers an admin and a specific user for a given organization.
 * @param {object} orgConfig - The configuration object for the organization.
 * @param {object} wallet - The wallet instance to store identities.
 */
async function registerIdentities(orgConfig, wallet) {
    try {
        // Create a new CA client for interacting with the CA.
        const ca = new FabricCAServices(orgConfig.caUrl, { trustedRoots: orgConfig.caTLSCACerts, verify: false }, orgConfig.caName);

        // 1. Enroll the organization's admin user
        console.log(`\n--> Enrolling admin for ${orgConfig.mspId}: ${orgConfig.adminId}`);
        let adminIdentity = await wallet.get(orgConfig.adminId);
        if (adminIdentity) {
            console.log(`An identity for the admin user "${orgConfig.adminId}" already exists in the wallet`);
        } else {
            const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: orgConfig.mspId,
                type: 'X.509',
            };
            await wallet.put(orgConfig.adminId, x509Identity);
            console.log(`Successfully enrolled admin user "${orgConfig.adminId}" and imported it into the wallet`);
            adminIdentity = x509Identity;
        }

        // 2. Register and enroll the specific user (e.g., regulator, labOverseer)
        console.log(`--> Registering & enrolling user for ${orgConfig.mspId}: ${orgConfig.userId}`);
        const userIdentity = await wallet.get(orgConfig.userId);
        if (userIdentity) {
            console.log(`An identity for the user "${orgConfig.userId}" already exists in the wallet`);
            return;
        }

        // Get the admin user context to register the new user
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, orgConfig.adminId);

        // Register the new user
        const secret = await ca.register({
            affiliation: orgConfig.affiliation,
            enrollmentID: orgConfig.userId,
            role: 'client',
            attrs: [
                { name: 'role', value: orgConfig.userRole, ecert: true },
                { name: 'uuid', value: orgConfig.userId, ecert: true }
            ],
        }, adminUser);

        // Enroll the new user
        const enrollment = await ca.enroll({
            enrollmentID: orgConfig.userId,
            enrollmentSecret: secret,
            attr_reqs: [
                { name: "role", optional: false },
                { name: "uuid", optional: false }
            ]
        });

        const x509UserIdentity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: orgConfig.mspId,
            type: 'X.509',
        };
        await wallet.put(orgConfig.userId, x509UserIdentity);
        console.log(`Successfully registered and enrolled user "${orgConfig.userId}" and imported it into the wallet`);

    } catch (error) {
        console.error(`Failed to register identities for ${orgConfig.mspId}: ${error}`);
        throw error; // Re-throw the error to be caught by the main try-catch block
    }
}


async function main() {
    try {
        // --- Configuration for Org1 ---
        const ccpPathOrg1 = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccpOrg1 = JSON.parse(fs.readFileSync(ccpPathOrg1, 'utf8'));
        const caInfoOrg1 = ccpOrg1.certificateAuthorities['ca.org1.example.com'];
        const org1Config = {
            caUrl: caInfoOrg1.url,
            caTLSCACerts: caInfoOrg1.tlsCACerts.pem,
            caName: caInfoOrg1.caName,
            mspId: 'Org1MSP',
            adminId: 'regulatorAdmin',
            userId: 'Regulator01',
            userRole: 'regulator',
            affiliation: 'org1.department1'
        };

        // --- Configuration for Org2 ---
        const ccpPathOrg2 = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
        const ccpOrg2 = JSON.parse(fs.readFileSync(ccpPathOrg2, 'utf8'));
        const caInfoOrg2 = ccpOrg2.certificateAuthorities['ca.org2.example.com'];
        const org2Config = {
            caUrl: caInfoOrg2.url,
            caTLSCACerts: caInfoOrg2.tlsCACerts.pem,
            caName: caInfoOrg2.caName,
            mspId: 'Org2MSP',
            adminId: 'labAdmin',
            userId: 'LabOverseer01',
            userRole: 'labOverseer',
            affiliation: 'org2.department1'
        };

        // Create a new file system based wallet for managing all identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        
        // Register identities for Org1
        await registerIdentities(org1Config, wallet);

        // Register identities for Org2
        await registerIdentities(org2Config, wallet);

    } catch (error) {
        console.error(`\n!!!!!! Script failed to run !!!!!!!`);
        process.exit(1);
    }
}

main();



