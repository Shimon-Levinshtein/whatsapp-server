const { Event } = require('../../models/events');
const { sendGoogleEmailEjs } = require('../../controllers/mail/sendMailEjs');
const { createEventbyDate } = require('../../evets/schedule/byDate');

module.exports.getEventsByUserId = (userData) => {
    return new Promise((resolve, reject) => {
        Event.find({ user: userData.userId })
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err.message);
            });
    });
};
module.exports.createEventsByType = (obj, userData) => {
    return new Promise((resolve, reject) => {
        const event = new Event({
            eventName: obj.data.eventName,
            type: obj.data.type,
            data: obj.data,
            user: userData.userId,
        });
        event.save().then(data => {
            createEventbyDate({
                eventId: data._id.toString(),
                eventData: data.data,
                userId: data.user.toString(),
            });
            resolve(data);
        }).catch(err => {
            reject(err.message);
        });
    });
};
module.exports.deleteEvents = (eventId, userData) => {
    return new Promise((resolve, reject) => {
        Event.deleteOne({ _id: eventId, user: userData.userId })
            .then(data => {
                resolve(data);
            }).catch(err => {
                reject(err.message);
            }
            );
    });
};
