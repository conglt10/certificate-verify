/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
var yargs = require('yargs');


const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', 'certificate-network', 'connection-academy.json');

async function main() {
    try {
        var argv = yargs.argv;
        var teacher_id = argv.userid.toString();

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        //console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(teacher_id);
        if (userExists) {
            console.log(`An identity for the user ${teacher_id} already exists in the wallet`);
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin');
        if (!adminExists) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, {
            wallet,
            identity: 'admin',
            discovery: { enabled: true, asLocalhost: true }
        });

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register(
            { affiliation: '', enrollmentID: teacher_id, role: 'client', attrs: [{ name: 'TeacherID', value: teacher_id, ecert: true }] },
            adminIdentity
        );
        const enrollment = await ca.enroll({ enrollmentID: teacher_id, enrollmentSecret: secret });
        const userIdentity = X509WalletMixin.createIdentity(
            'AcademyMSP',
            enrollment.certificate,
            enrollment.key.toBytes()
        );
        await wallet.import(teacher_id, userIdentity);
        console.log(
            `Successfully registered and enrolled admin user ${teacher_id} and imported it into the wallet`
        );

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to register user ${teacher_id}: ${error}`);
        process.exit(1);
    }
}

main();
