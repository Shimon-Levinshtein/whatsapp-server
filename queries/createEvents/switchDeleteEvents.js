const { deletedayInMonthListEvents } = require("../../evets/dayInMonth/dayInMonth");
const { deleteEventInComingMessage } = require("../../evets/inComingMessage/inComingMessage");
const { deleteEventByDate } = require("../../evets/schedule/byDate");

module.exports.switchDeleteEventsByType = (eventId, type, userId) => {

    switch (type) {
        case 'messageByDate':
            deleteEventByDate(eventId);
            break;
        case 'EveryMonthByDayInMonth':
            deletedayInMonthListEvents(eventId);
            break;
        case 'messageByTextReceived':
            deleteEventInComingMessage(eventId, userId);
            break;
        default:
            break;
    }
};
