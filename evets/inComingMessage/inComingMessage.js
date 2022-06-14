// const { sendMessage } = require('../sendMessage/sendMessage');

const moment = require("moment");
const { replayMessage } = require("./replayMessage");

const inComingMessageListEvents = new Map();

exports.inComingMessage = ({ eventId, eventData, userId, isEdit = false }) => {

    if (!inComingMessageListEvents.has(userId)) {
        inComingMessageListEvents.set(userId, {});
    };
    if (isEdit) {
        try {
            if (inComingMessageListEvents.has(userId)) {
                const event = inComingMessageListEvents.get(userId);
                if (event.hasOwnProperty(eventId)) {
                    event[eventId] = eventData;
                    inComingMessageListEvents.set(userId, event);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    const oldEvent = inComingMessageListEvents.get(userId);
    oldEvent[eventId] = eventData;
    inComingMessageListEvents.set(userId, oldEvent);
};

exports.listenMessages = (userId, message) => {
    if (message.type == 'chat') {
        try {
            if (inComingMessageListEvents.has(userId)) {
                const events = inComingMessageListEvents.get(userId);
                Object.keys(events)
                    .map(key => events[key])
                    .forEach(event => {
                        const allContacts = [...event.contactsList, ...event.groupList];
                        const mapContacts = allContacts.map(i => i.serializedId);
                        if (mapContacts.includes(message.from)) {
                            event.replyToInComingMessage.forEach(item => {
                                if (item.isBetweenTime) {
                                    if (!checkingTimes(item.arrTimesUTC)) return;
                                }
                                switch (item.typeCondition) {
                                    case 'all':
                                        replayMessage({
                                            serializedId: message.from,
                                            userId,
                                            message: item.sendMessage,
                                        })
                                        break;
                                    case 'containing':
                                        if (message.body.toLowerCase().includes(item.isComingMessage.toLowerCase())) {
                                            replayMessage({
                                                serializedId: message.from,
                                                userId,
                                                message: item.sendMessage,
                                            })
                                        }
                                        break;
                                    case 'exact':
                                        if (message.body.toLowerCase() == item.isComingMessage.toLowerCase()) {
                                            replayMessage({
                                                serializedId: message.from,
                                                userId,
                                                message: item.sendMessage,
                                            })
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            });
                        }
                    });
            }
        } catch (error) {
            console.log(error);
        }
    }
};
const checkingTimes = arrTimes => {
    let result = false;
    arrTimes.forEach(time => {
        const now = new Date();
        let start = new Date(time.startTime);
        start.setDate(now.getDate());
        start.setMonth(now.getMonth());
        start.setFullYear(now.getFullYear());

        let end = new Date(time.endTime);
        end.setDate(now.getDate());
        end.setMonth(now.getMonth());
        end.setFullYear(now.getFullYear());

        if (end.getTime() < start.getTime()) {
            const newDate = new Date(moment(end).add(1, 'days'));
            end = newDate;
        }
      
        if (now.getTime() > start.getTime() && now.getTime() < end.getTime()) {
            result = true;
        }
    });
    return result;
};

const deleteEventInComingMessage = (eventId, userId) => {
    try {
        if (inComingMessageListEvents.has(userId)) {
            const event = inComingMessageListEvents.get(userId);
            if (event.hasOwnProperty(eventId)) {
                delete event[eventId];
                inComingMessageListEvents.set(userId, event);
            }
        }
    } catch (error) {
        console.log(error);
    }
};
exports.deleteEventInComingMessage = deleteEventInComingMessage;