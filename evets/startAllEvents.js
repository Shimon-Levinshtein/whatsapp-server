const { Event } = require("../models/events");
const { createEventbyDayInMonth } = require("./dayInMonth/dayInMonth");
const { createEventbyDate } = require("./schedule/byDate");

module.exports.startAllEvents = () => {
    try {
        Event.find({})
            .then(events => {
                events.forEach(event => {
                    const schema = {
                        eventId: event._id.toString(),
                        eventData: event.data,
                        userId: event.user.toString(),
                        isEdit: false,
                    }
                    switch (event.type) {
                        case 'messageByDate':
                            createEventbyDate(schema);
                            break;
                        case 'EveryMonthByDayInMonth':
                            createEventbyDayInMonth(schema);
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