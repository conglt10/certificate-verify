const router = require('express').Router();

router.get('/hello', (req, res) => {
    res.json({ test: "yes"});
});

module.exports = router;
