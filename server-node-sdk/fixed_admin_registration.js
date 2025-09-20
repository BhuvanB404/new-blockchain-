// registerOrg1AdminOrg2Admin.js - FIXED with proper attributes
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

        // 1. Enroll the organization's admin user WITH PROPER ATTRIBUTES
        console.log(`\n--> Enrolling admin for ${orgConfig.mspId}: ${orgConfig.adminId}`);
        let adminIdentity = await wallet.get(orgConfig.adminId);
        if (adminIdentity) {
            console.log(`An identity for the admin user "${orgConfig.adminId}" already exists in the wallet`);
            console.log(`Removing existing admin identity to re-enroll with proper attributes...`);
            await wallet.remove(orgConfig.adminId);
        }

        // Enroll admin with proper attributes for chaincode compatibility
        const adminEnrollment = await ca.enroll({ 
            enrollmentID: 'admin', 
            enrollmentSecret: 'adminpw',
            attr_reqs: [
                { name: "hf.Registrar.Roles", optional: false },
                { name: "hf.Registrar.Attributes", optional: false },
                { name: "hf.Revoker", optional: false },
                { name: "hf.GenCRL", optional: false }
            ]
        });

        // Create admin identity with chaincode-compatible attributes
        const adminX509Identity = {
            credentials: {
                certificate: adminEnrollment.certificate,
                privateKey: adminEnrollment.key.toBytes(),
            },
            mspId: orgConfig.mspId,
            type: 'X.509',
        };
        
        await wallet.put(orgConfig.adminId, adminX509Identity);
        console.log(`Successfully enrolled admin user "${orgConfig.adminId}" with proper attributes`);
        adminIdentity = adminX509Identity;

        // 2. Register and enroll the specific user (e.g., regulator, labOverseer)
        console.log(`--> Registering & enrolling user for ${orgConfig.mspId}: ${orgConfig.userId}`);
        
        // Remove existing user identity if it exists
        const existingUserIdentity = await wallet.get(orgConfig.userId);
        if (existingUserIdentity) {
            console.log(`Removing existing user identity "${orgConfig.userId}" to re-enroll...`);
            await wallet.remove(orgConfig.userId);
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

        // Enroll the new user WITH ATTRIBUTE REQUESTS
        const userEnrollment = await ca.enroll({
            enrollmentID: orgConfig.userId,
            enrollmentSecret: secret,
            attr_reqs: [
                { name: "role", optional: false },
                { name: "uuid", optional: false }
            ]
        });

        const x509UserIdentity = {
            credentials: {
                certificate: userEnrollment.certificate,
                privateKey: userEnrollment.key.toBytes(),
            },
            mspId: orgConfig.mspId,
            type: 'X.509',
        };
        await wallet.put(orgConfig.userId, x509UserIdentity);
        console.log(`Successfully registered and enrolled user "${orgConfig.userId}" with role "${orgConfig.userRole}"`);

    } catch (error) {
        console.error(`Failed to register identities for ${orgConfig.mspId}: ${error}`);
        throw error;
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

        console.log('\n=== SUCCESS ===');
        console.log('All admin and user identities have been properly enrolled with required attributes');
        console.log('You can now use these identities for chaincode operations:');
        console.log('- regulatorAdmin (Org1) - can onboard farmers and manufacturers');
        console.log('- Regulator01 (Org1) - regulator with role/uuid attributes');
        console.log('- labAdmin (Org2) - can onboard laboratories');
        console.log('- LabOverseer01 (Org2) - lab overseer with role/uuid attributes');

    } catch (error) {
        console.error(`\n!!!!!! Script failed to run !!!!!!`);
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();