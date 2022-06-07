const schedule = require('node-schedule');
const { Event } = require('../../models/events');
const { sendMessage } = require('../sendMessage/sendMessage');

const byDateListEvents = new Map();

exports.createEventbyDate = ({ eventId, eventData, userId, isEdit = false }) => {
    if (isEdit) {
        try {
            if (byDateListEvents.has(eventId)) {
                const event = byDateListEvents.get(eventId);
                if (event) {
                    event.cancel();
                    byDateListEvents.delete(eventId);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (new Date(eventData.date) < new Date()) {
        deleteEvent({ eventId, userId });
        return;
    };
    const event = schedule.scheduleJob(eventData.date, () => {
        sendMessage({ eventId, eventData, userId });
        event.cancel();
        byDateListEvents.delete(eventId);
        deleteEvent({ eventId, userId });
    });
    byDateListEvents.set(eventId, event);
};

const deleteEvent = ({ eventId, userId }) => {
    try {
        if (byDateListEvents.has(eventId)) {
            const event = byDateListEvents.get(eventId);
            if (event) {
                event.cancel();
                byDateListEvents.delete(eventId);
            }
        }
        Event.deleteOne({ _id: eventId, user: userId })
            .then(() => { }).catch(err => {
                console.log(err.message);
            }
            );
    } catch (error) {
        console.log(error);
    }
};
const deleteEventByDate = (eventId) => {
    try {
        if (byDateListEvents.has(eventId)) {
            const event = byDateListEvents.get(eventId);
            if (event) {
                event.cancel();
                byDateListEvents.delete(eventId);
            }
        }
    } catch (error) {
        console.log(error);
    }
};
exports.deleteEventByDate = deleteEventByDate;