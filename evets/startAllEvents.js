const { Event } = require("../models/events");

module.exports.startAllEvents = () => {

    Event.find({})
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err.message);
            });
};