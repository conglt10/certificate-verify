/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
var yargs = require('yargs');

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', 'certificate-network', 'connection-academy.json');

async function main() {
    try {
        var argv = yargs.argv;
        var user_id = argv.userid.toString();

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        //console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(user_id);
        if (!userExists) {
            console.log(`An identity for the user ${user_id} does not exist in the wallet`);
            console.log(`Run the registerUser.js --userid ${user_id} application before retrying`);
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, {
            wallet,
            identity: user_id,
            discovery: { enabled: true, asLocalhost: true }
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('certificatechannel');

        // Get the contract from the network.
        const contract = network.getContract('academy');

        // Submit the specified transaction.
        var FunctionName = argv.f.toString();
        if (FunctionName == 'CreateSubject' && user_id == 'admin'){
            var SubjectID = argv.subjectid.toString();
            var SubjectCode = argv.subjectcode.toString();
            var Name = argv.subjectname.toString();
            var Weight = argv.weight.toString();
            await contract.submitTransaction(FunctionName, SubjectID, SubjectCode, Name, Weight);
            console.log('Transaction has been submitted');
            process.exit(0);
        }else if (FunctionName == 'CreateScore'){
            var SubjectID = argv.subjectid.toString();
            var StudentID = argv.studentid.toString();
            var Score = argv.score.toString();
            await contract.submitTransaction(FunctionName, SubjectID, StudentID, Score);
            console.log('Transaction has been submitted');
            process.exit(0);
        }else if (FunctionName == 'CreateCertificate'){
            var StudentID = argv.studentid.toString();
            await contract.submitTransaction(FunctionName, StudentID);
            console.log('Transaction has been submitted');
            process.exit(0);
        }else {
            console.log("Failed!")
            process.exit(0)
        }

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
