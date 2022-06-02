const { createEventbyDayInMonth } = require("../../evets/dayInMonth/dayInMonth");
const { createEventbyDate } = require("../../evets/schedule/byDate");

module.exports.switchCreateEventsByType = (data) => {

    switch (data.eventData.type) {
        case 'messageByDate':
            createEventbyDate(data);
            break;
        case 'EveryMonthByDayInMonth':
            createEventbyDayInMonth(data);
            break;
        default:
            break;
    }
};
