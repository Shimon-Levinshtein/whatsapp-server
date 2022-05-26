const express = require('express');
const router = express.Router();
const { createEventsByType, getEventsByUserId, deleteEvents } = require('../../queries/createEvents/createEvents');


router.get('/get-user-events', function (req, res, next) {
  getEventsByUserId(req.userData)
  .then(data => {
    res.send(data);
  }).catch(err => {
    console.log('err--------------------------------------');
    console.log(err);
    res.status(500).send({ error: err })
  });
});

router.post('/create-event-by-type', function (req, res, next) {
  createEventsByType(req.body, req.userData)
    .then(data => {
      res.send(data);
    }).catch(err => {
      res.status(500).send({ error: err })
    });
});

router.post('/delete-event', function (req, res, next) {
  deleteEvents(req.body.data, req.userData)
    .then(data => {
      res.send(data);
    }).catch(err => {
      res.status(500).send({ error: err })
    });
});

module.exports = router;
