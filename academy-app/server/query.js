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

        // Evaluate the specified transaction.
        // QueryStudent transaction - requires 1 argument, ex: ('QueryStudent', '20156425')
        var FunctionName = argv.f.toString();
        if (FunctionName == 'QueryStudent'){
            var StudentID = argv.studentid.toString();
            const result = await contract.evaluateTransaction(FunctionName, StudentID);
            console.log(`\nStudent:\n\n${result.toString()}\n`);
            process.exit(0);
        }else if (FunctionName == 'QuerySubject'){
            var SubjectID = argv.subjectid.toString();
            const result = await contract.evaluateTransaction(FunctionName, SubjectID);
            console.log(`\nSubject:\n\n${result.toString()}`);
            process.exit(0);
        }else if (FunctionName == 'QueryCertificate'){
            var StudentID = argv.studentid.toString();
            const result = await contract.evaluateTransaction(FunctionName, StudentID);
            console.log(`\nCertificate:\n\n${result.toString()}\n`);
            process.exit(0);
        }else if (FunctionName == 'QueryScore') {
            var SubjectID = argv.subjectid.toString();
            var StudentID = argv.studentid.toString();
            const result = await contract.evaluateTransaction(FunctionName, SubjectID, StudentID);
            console.log(`\nScore:\n\n${result.toString()}\n`);
            process.exit(0);
        }else if (FunctionName == 'GetAllStudents' || FunctionName == 'GetAllSubjects' || FunctionName == 'GetAllScores' || FunctionName == 'GetAllCertificates') {
            const result = await contract.evaluateTransaction(FunctionName);
            console.log(`\nResult:\n\n${result.toString()}\n`);
            process.exit(0);
        }
        else {
            console.log("Failed!")
            process.exit(0)
        }

    } catch (error){
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
