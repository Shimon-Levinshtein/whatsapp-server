const { createEventbyDayInMonth } = require("../../evets/dayInMonth/dayInMonth");
const { inComingMessage } = require("../../evets/inComingMessage/inComingMessage");
const { createEventbyDate } = require("../../evets/schedule/byDate");

module.exports.switchCreateEventsByType = (data) => {

    switch (data.eventData.type) {
        case 'messageByDate':
            createEventbyDate(data);
            break;
        case 'EveryMonthByDayInMonth':
            createEventbyDayInMonth(data);
            break;
        case 'messageByTextReceived':
            inComingMessage(data);
            break;
        default:
            break;
    }
};
