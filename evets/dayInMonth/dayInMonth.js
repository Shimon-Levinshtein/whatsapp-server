const schedule = require('node-schedule');
const { Event } = require('../../models/events');
const { mapUsers } = require('../../socket/whatsapp');
const { sendMessage } = require('../sendMessage/sendMessage');

const dayInMonthListEvents = new Map();
exports.createEventbyDayInMonth = ({ eventId, eventData, userId, isEdit = false }) => {
    const hour = new Date(eventData.date).getHours();
    const minute = new Date(eventData.date).getMinutes();
    const cronitor = `${minute} ${hour} ${eventData.dayInMonths} * *`;
    if (isEdit) {
        try {
            if (dayInMonthListEvents.has(eventId)) {
                const event = dayInMonthListEvents.get(eventId);
                if (event) {
                    event.cancel();
                    dayInMonthListEvents.delete(eventId);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    const event = schedule.scheduleJob(cronitor, () => {
        sendMessage({ eventId, eventData, userId });
    });
    dayInMonthListEvents.set(eventId, event);
};

const deletedayInMonthListEvents = (eventId) => {
    try {
        if (dayInMonthListEvents.has(eventId)) {
            const event = dayInMonthListEvents.get(eventId);
            if (event) {
                event.cancel();
                dayInMonthListEvents.delete(eventId);
            }
        }
    } catch (error) {
        console.log(error);
    }
};
exports.deletedayInMonthListEvents = deletedayInMonthListEvents;