const { Event } = require("../models/events");
const { createEventbyDate } = require("./schedule/byDate");

module.exports.startAllEvents = () => {
    try {
        Event.find({})
            .then(events => {
                events.forEach(event => {
                    switch (event.type) {
                        case 'messageByDate':
                            createEventbyDate({
                                eventId: event._id.toString(),
                                eventData: event.data,
                                userId: event.user.toString(),
                                isEdit: false,
                            });
                            break;
                        default:
                            break;
                    }
                });
            })
            .catch(err => {
                console.log(err.message);
            });
    } catch (error) {
        console.log(error);
    }
};