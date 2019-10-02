const router = require('express').Router();
const USER_ROLES = require('../configs/constant').USER_ROLES;
const network = require('../fabric/network.js');
const { validationResult, sanitizeParam, check } = require('express-validator');

router.get('/all', async (req, res) => {
  if (req.decoded.user.role === USER_ROLES.STUDENT) {
    res.status(401).json({
      success: false,
      msg: 'Failed'
    });
  }

  let username = req.decoded.user.username;

  let networkObj = await network.connectToNetwork(username);

  if (networkObj.error) {
    res.status(500).json({
      success: false,
      msg: 'Failed'
    });
  }

  let response = await network.query(networkObj, 'GetAllStudents');

  if (!response) {
    res.status(404).json({
      success: false,
      msg: 'Not Found'
    });
  } else {
    res.json(response);
  }
});

router.get('/create', async (req, res) => {
  if (
    req.decoded.user.role != USER_ROLES.ADMIN_ACADEMY &&
    req.decoded.user.role != USER_ROLES.ADMIN_STUDENT
  ) {
    res.status(401).json({
      success: false,
      msg: 'Permission Denied'
    });
  } else {
    res.json({
      success: true
    });
  }
});

router.get(
  '/:id',
  [
    sanitizeParam('id')
      .trim()
      .escape()
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() });
    }

    let username = req.decoded.user.username;

    let networkObj = await network.connectToNetwork(username);

    if (networkObj.error) {
      res.status(500).send(networkObj);
    }

    let response = await network.query(networkObj, 'QueryStudent', req.params.id);

    if (!response) {
      res.status(404).json({
        success: false,
        msg: 'Not Found'
      });
    } else {
      res.json(response);
    }
  }
);

router.post(
  '/create',
  [
    check('fullname')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('username')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('address')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('phone')
      .not()
      .isEmpty()
      .trim()
      .escape()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    if (
      req.decoded.user.role !== USER_ROLES.ADMIN_ACADEMY ||
      req.decoded.user.role !== USER_ROLES.ADMIN_STUDENT
    ) {
      res.status(401).json({
        success: false,
        msg: 'Permission Denied'
      });
    } else {
      let username = req.decoded.user.username;
      let fullname = req.body.fullname;
      let address = req.body.address;
      let phone = req.body.phone;

      let networkObj = await network.connectToNetwork(username);

      if (networkObj.error) {
        res.status(500).json({
          success: false,
          msg: 'Failed'
        });
      }

      let response = await network.createStudent(networkObj, username, fullname, address, phone);

      if (!response) {
        res.status(404).json({
          success: false,
          msg: 'Not Found'
        });
      } else {
        res.json({
          success: true,
          msg: 'Create student success'
        });
      }
    }
  }
);

module.exports = router;
