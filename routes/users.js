var express = require('express');
var router = express.Router();
const { creatUser, login, loginRefresh } = require('../queries/user/authentication');


router.post('/sing-up', function (req, res, next) {
  creatUser(req.body).then(data => {
    res.send(data);
  }).catch(err => {
    console.log(err);
    res.status(500).send({ error: err })
  });
});

router.post('/login', function (req, res, next) {
  login(req.body).then(data => {
    res.send(data);
  }).catch(err => {
    console.log(err);
    res.status(500).send({ error: err })
  });
});
router.post('/login-refresh', function (req, res, next) {
  loginRefresh(req.body).then(data => {
    res.send(data);
  }).catch(err => {
    console.log(err);
    res.status(500).send({ error: err })
  });
});

module.exports = router;
