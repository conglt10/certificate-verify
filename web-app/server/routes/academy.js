const router = require('express').Router();
const network = require('../fabric/network.js');
const { validationResult, sanitizeParam } = require('express-validator');

router.get('/students', async (req, res) => {
  let username = req.decoded.user.username;

  let networkObj = await network.connectToNetwork(username, 'academy');

  if (networkObj.error) {
    res.send(networkObj);
  }
  let response = await network.query(networkObj, 'GetAllStudents');
  let parsedResponse = await JSON.parse(response);
  res.send(parsedResponse);
});

router.get('/certificates', async (req, res) => {
  let username = req.decoded.user.username;

  let networkObj = await network.connectToNetwork(username, 'academy');

  if (networkObj.error) {
    res.send(networkObj);
  }

  let response = await network.query(networkObj, 'GetAllCertificates');
  let parsedResponse = await JSON.parse(response);
  res.send(parsedResponse);
});

router.get('/subject/:id/scores', async (req, res) => {});

// Set Score
router.post('/score', async (req, res) => {});

router.post('/register', async (req, res) => {});

module.exports = router;
