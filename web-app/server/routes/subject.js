const router = require('express').Router();
const USER_ROLES = require('../configs/constant').USER_ROLES;
const network = require('../fabric/network');
const { check, validationResult, sanitizeParam } = require('express-validator');

router.get('/create', async (req, res) => {
  if (req.decoded.user.role !== USER_ROLES.ADMIN_ACADEMY) {
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

router.post(
  '/create',
  [
    check('subjectname').isLength({ min: 6 }),
    check('subjectid')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('teacherusername')
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

    if (req.decoded.user.role !== USER_ROLES.ADMIN_ACADEMY) {
      res.status(401).json({
        success: false,
        msg: 'Permission Denied'
      });
    } else {
      let username = req.decoded.user.username;
      let subjectId = req.body.subjectid;
      let subjectName = req.body.subjectname;
      let teacherUsername = req.body.teacherusername;

      let networkObj = await network.connectToNetwork(username);

      if (networkObj.error) {
        res.status(500).json({
          success: false,
          msg: 'Failed'
        });
      }

      let response = await network.createSubject(
        networkObj,
        subjectId,
        subjectName,
        teacherUsername
      );

      if (!response) {
        res.status(404).json({
          success: false,
          msg: 'Not Found'
        });
      } else {
        res.json({
          success: true,
          msg: 'Create subject success'
        });
      }
    }
  }
);

router.get('/all', async (req, res) => {
  let username = req.decoded.user.username;

  let networkObj = await network.connectToNetwork(username);

  if (networkObj.error) {
    res.status(500).send(networkObj);
  }

  let response = await network.query(networkObj, 'GetAllSubjects');

  if (!response) {
    res.status(404).send({ error: 'Not Found' });
  } else {
    res.json(response);
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
      res.send(networkObj);
    }

    let response = await network.query(networkObj, 'QuerySubject', req.params.id);
    if (!response) {
      res.status(404).send({ error: 'Not Found' });
    } else {
      res.json(response);
    }
  }
);

module.exports = router;
