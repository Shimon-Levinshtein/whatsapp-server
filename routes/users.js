var express = require('express');
var router = express.Router();
const { creatUser } = require('../queries/user/authentication');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/sing-up', function (req, res, next) {
  creatUser(req.body).then(data => {
      res.send(data); // send the qr code as json
    }).catch(err => {
      console.log(err);
      res.status(500).json({ err });
    });
});

module.exports = router;
