var express = require('express');
var router = express.Router();
const { creatUser } = require('../queries/user/authentication');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/sing-up', function (req, res, next) {


  creatUser(req.body).then(data => {
      res.send(data); 
    }).catch(err => {
      console.log(err);
      res.status(500).send({ error: err })
    });
});

module.exports = router;
