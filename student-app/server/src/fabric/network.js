'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const util = require('util');

// //connect to the config file
// const configPath = path.join(process.cwd(), './config.json');
// const configJSON = fs.readFileSync(configPath, 'utf8');
// const config = JSON.parse(configJSON);
// let connection_file = config.connection_file;
// // let userName = config.userName;
// let gatewayDiscovery = config.gatewayDiscovery;
// let appAdmin = config.appAdmin;
// let orgMSPID = config.orgMSPID;

// // connect to the connection file
// const ccpPath = path.join(process.cwd(), connection_file);
// const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
// const ccp = JSON.parse(ccpJSON);

exports.connectToNetwork = async function(userName) {
    const gateway = new Gateway();

    try {
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);

        const userExists = await wallet.exists(userName);

        if (!userExists) {
            let response = {};
            response.error =
                'An identity for the user ' +
                userName +
                ' does not exist in the wallet. Register ' +
                userName +
                ' first';
            return response;
        }

        await gateway.connect(ccp, { wallet, indentity: userName, discovery: gatewayDiscovery });

        const network = await gateway.getNetwork('certificatechannel');
        const contract = await network.getContract('certificate');

        let networkObj = {
            contract: contract,
            network: network,
            gateway: gateway
        };
    } catch (error) {
        let response = {};
        response.error = error;
        return response;
    } finally {
        console.log('Done connecting to network.');
    }
};

exports.invoke = async function(networkObj, isQuery, func, args) {
    try {
        if (isQuery === true) {
            if (args) {
                let response = await networkObj.contract.evaluateTransaction(func, args);
                await networkObj.gateway.disconnect();
                return response;
            } else {
                let response = await networkObj.contract.evaluateTransaction(func);
                await networkObj.gateway.disconnect();
                return response;
            }
        } else {
            if (args) {
                args = JSON.parse(args[0]);
                args = JSON.stringify(args);

                let response = await networkObj.contract.submitTransaction(func, args);

                await networkObj.gateway.disconnect();

                return response;
            } else {
                let response = await networkObj.contract.submitTransaction(func);

                await networkObj.gateway.disconnect();
                return response;
            }
        }
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return error;
    }
};
