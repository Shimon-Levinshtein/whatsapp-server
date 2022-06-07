const { sendMessage } = require('../sendMessage/sendMessage');

const inComingMessageListEvents = new Map();

exports.inComingMessage = ({ eventId, eventData, userId, isEdit = false }) => {

    if (!inComingMessageListEvents.has(userId)) {
        inComingMessageListEvents.set(userId, {});
    };
    // if (isEdit) {
    //     try {
    //         if (byDateListEvents.has(eventId)) {
    //             const event = byDateListEvents.get(eventId);
    //             if (event) {
    //                 event.cancel();
    //                 byDateListEvents.delete(eventId);
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    const oldEvent = inComingMessageListEvents.get(userId);
    oldEvent[eventId] = eventData;
    inComingMessageListEvents.set(userId, oldEvent);


    // const event = schedule.scheduleJob(eventData.date, () => {
    //     sendMessage({ eventId, eventData, userId });
    //     event.cancel();
    //     byDateListEvents.delete(eventId);
    //     deleteEvent({ eventId, userId });
    // });
    // byDateListEvents.set(eventId, event);
};

// const deleteEvent = ({ eventId, userId }) => {
//     try {
//         if (byDateListEvents.has(eventId)) {
//             const event = byDateListEvents.get(eventId);
//             if (event) {
//                 event.cancel();
//                 byDateListEvents.delete(eventId);
//             }
//         }
//         Event.deleteOne({ _id: eventId, user: userId })
//             .then(() => { }).catch(err => {
//                 console.log(err.message);
//             }
//             );
//     } catch (error) {
//         console.log(error);
//     }
// };
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