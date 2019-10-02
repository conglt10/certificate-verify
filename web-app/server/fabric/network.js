'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');

exports.connectToNetwork = async function(userName, orgId = 'student', cli = false) {
  const gateway = new Gateway();

  try {
    const ccpPath = path.resolve(
      __dirname,
      '../../..',
      'certificate-network',
      `connection-${orgId}.json`
    );
    let walletPath = path.join(process.cwd(), `./cli/wallet-${orgId}`);

    if (cli) {
      walletPath = path.join(process.cwd(), `wallet-${orgId}`);
    }

    const wallet = new FileSystemWallet(walletPath);

    const userExists = await wallet.exists(userName);

    let isAdmin = false;

    let networkObj;

    if (!userExists) {
      let response = {};
      response.error =
        'An identity for the user ' +
        userName +
        ' does not exist in the wallet. Register ' +
        userName +
        ' first';
      return response;
    } else {
      if (userName === 'admin') {
        isAdmin = true;
      }

      await gateway.connect(ccpPath, {
        wallet: wallet,
        identity: userName,
        discovery: { enabled: true, asLocalhost: true }
      });

      const network = await gateway.getNetwork('certificatechannel');
      const contract = await network.getContract('academy');

      networkObj = {
        contract: contract,
        network: network,
        gateway: gateway,
        isAdmin: isAdmin
      };
    }

    return networkObj;
  } catch (error) {
    let response = {};
    response.error = error;
    return response;
  }
};

exports.query = async function(networkObj, func, args) {
  try {
    if (Array.isArray(args)) {
      let response = await networkObj.contract.evaluateTransaction(func, ...args);

      await networkObj.gateway.disconnect();
      return response;
    } else if (args) {
      let response = await networkObj.contract.evaluateTransaction(func, args);

      await networkObj.gateway.disconnect();
      return response;
    } else {
      let response = await networkObj.contract.evaluateTransaction(func);

      await networkObj.gateway.disconnect();
      return response;
    }
  } catch (error) {
    return error;
  }
};

exports.createStudent = async function(networkObj, studentId, studentName) {
  try {
    let response = await networkObj.contract.submitTransaction(
      'CreateStudent',
      studentId,
      studentName
    );
    await networkObj.gateway.disconnect();
    return response;
  } catch (error) {
    return error;
  }
};

exports.createSubject = async function(networkObj, Name ) {
  try {
    if (!networkObj.isAdmin) {
      return 'Permission denied';
    }
    var SubjectID = function () {
      return '_' + Math.random().toString(36).substr(2, 9);
    };
    let response = await networkObj.contract.submitTransaction(
      'CreateSubject',
      SubjectID,
      Name,
      Weight
    );
    await networkObj.gateway.disconnect();
    return response;
  } catch (error) {
    return error;
  }
};

exports.createScore = async function(networkObj, SubjectID, StudentID, Score) {
  try {
    let response = await networkObj.contract.submitTransaction(
      'CreateScore',
      SubjectID,
      StudentID,
      Score
    );
    await networkObj.gateway.disconnect();
    return response;
  } catch (error) {
    return error;
  }
};

exports.createCertificate = async function(networkObj, StudentID) {
  try {
    let response = await networkObj.contract.submitTransaction('CreateCertificate', StudentID);
    await networkObj.gateway.disconnect();
    return response;
  } catch (error) {
    return error;
  }
};

exports.registerUser = async function(userId, orgId = 'student') {
  if (!userId) {
    let response = {};
    response.error = 'Error! You need to fill all fields before you can register!';
    return response;
  }

  try {
    const ccpPath = path.resolve(
      __dirname,
      '../../..',
      'certificate-network',
      `connection-${orgId}.json`
    );
    const walletPath = path.join(process.cwd(), `./cli/wallet-${orgId}/`);
    const wallet = new FileSystemWallet(walletPath);
    const orgMSP = await changeCaseFirstLetter(orgId);

    const userExists = await wallet.exists(userId);
    if (userExists) {
      console.log(`An identity for the user ${userId} already exists in the wallet`);
      return;
    }

    const adminExists = await wallet.exists('admin');
    if (!adminExists) {
      console.log('An identity for the admin user "admin" does not exist in the wallet');
      console.log('Run the enrollAdmin.js application before retrying');
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccpPath, {
      wallet,
      identity: 'admin',
      discovery: { enabled: true, asLocalhost: true }
    });

    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();

    const secret = await ca.register(
      { affiliation: '', enrollmentID: userId, role: 'client' },
      adminIdentity
    );

    const enrollment = await ca.enroll({ enrollmentID: userId, enrollmentSecret: secret });
    const userIdentity = X509WalletMixin.createIdentity(
      `${orgMSP}MSP`,
      enrollment.certificate,
      enrollment.key.toBytes()
    );
    await wallet.import(userId, userIdentity);
    console.log(
      `Successfully registered and enrolled admin user ${userId} and imported it into the wallet`
    );

    await gateway.disconnect();
    let response = `Successfully registered student`;
    return response;
  } catch (error) {
    console.error(`Failed to register student`);
    let response = {};
    response.error = error;
    return response;
  }
};

function changeCaseFirstLetter(params) {
  if (typeof params === 'string') {
    return params.charAt(0).toUpperCase() + params.slice(1);
  }
  return null;
}
