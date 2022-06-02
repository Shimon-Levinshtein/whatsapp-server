const { deletedayInMonthListEvents } = require("../../evets/dayInMonth/dayInMonth");
const { deleteEventByDate } = require("../../evets/schedule/byDate");

module.exports.switchDeleteEventsByType = (eventId, type) => {

    switch (type) {
        case 'messageByDate':
            deleteEventByDate(eventId);
            break;
        case 'EveryMonthByDayInMonth':
            deletedayInMonthListEvents(eventId);
            break;
        default:
            break;
    }
};
