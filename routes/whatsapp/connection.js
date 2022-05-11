var express = require('express');
const { getWhatsappQrCode } = require('../../queries/whatsapp');
var router = express.Router();

/* GET home page. */
router.post('/connect-qr', function (req, res, next) {
  getWhatsappQrCode()
    .then(qr => {
      res.send(qr); // send the qr code as json
    }).catch(err => {
      res.status(500).json({ err });
    });
});

module.exports = router;
