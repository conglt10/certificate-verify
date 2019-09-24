/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
var yargs = require('yargs');

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', 'certificate-network', 'connection-student.json');

async function main() {
    try {
        var argv = yargs.argv;
        var user_id = argv.userid.toString();

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(user_id);
        if (!userExists) {
            console.log(`An identity for the student ${user_id} does not exist in the wallet`);
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

        // Evaluate the specified transaction.
        // QueryStudent transaction - requires 1 argument, ex: ('QueryStudent')
        var FunctionName = argv.f.toString();
        if (FunctionName == 'QueryStudent'){
            const result = await contract.evaluateTransaction(FunctionName, '0');
            console.log(`\nStudent:\n\n${result.toString()}\n`);
            process.exit(0);
        }else if (FunctionName == 'QuerySubject'){
            SubjectID = argv.subjectid.toString();
            const result = await contract.evaluateTransaction(FunctionName, SubjectID);
            console.log(`\nSubject:\n\n${result.toString()}\n`);
            process.exit(0);
        }else if (FunctionName == 'QueryCertificate'){
            const result = await contract.evaluateTransaction(FunctionName, "");
            console.log(`\nCertificate:\n\n${result.toString()}\n`);
            process.exit(0);
        }else if (FunctionName == 'QueryScore') {
            var SubjectID = argv.subjectid.toString();
            const result = await contract.evaluateTransaction(FunctionName, SubjectID, "");
            console.log(`\nScore:\n\n${result.toString()}\n`);
            process.exit(0);
        }else if (FunctionName == 'GetAllSubjects' || FunctionName == 'GetAllScores') {
            const result = await contract.evaluateTransaction(FunctionName);
            console.log(`\nResult:\n\n${result.toString()}\n`);
            process.exit(0);
        }else {
            console.log("Failed!")
            process.exit(0)
        }

    } catch (error){
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
