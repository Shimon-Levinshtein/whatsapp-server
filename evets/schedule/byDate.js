const schedule = require('node-schedule');
const { Event } = require('../../models/events');
const { mapUsers } = require('../../socket/whatsapp');

const byDateListEvents = new Map();

exports.createEventbyDate = ({ eventId, eventData, userId }) => {

    if (new Date(eventData.date) < new Date()) {
        deleteEvent({ eventId, userId });
        return;
    };
    const event = schedule.scheduleJob(eventData.date, () => {
        const user = mapUsers.get(userId);
        if (user.isConnected) {
            user.client.getContacts().then(contacts => {
                const contactsList = [];
                eventData.contactsList.forEach(cont => {
                    let result = false;
                    if (cont.name !== 'Not a contact') {
                        result = contacts.find((c) => c.name === cont.name);
                    } else {
                        if (cont.phone) {
                            result = contacts.find((c) => c.phone === cont.phone);
                        }
                    }
                    if (result) {
                        contactsList.push(result);
                    }
                });
                contactsList.forEach(contactToSend => {
                    user.client.sendMessage(contactToSend.id._serialized, eventData.message);
                });
                user.socket.emit(`response_event_ended_id:${userId}`, { eventId: eventId });
            });
        }
        event.cancel();
        byDateListEvents.delete(eventId);
        deleteEvent({ eventId, userId });
    });
    byDateListEvents.set(eventId, event);
};

const deleteEvent = ({ eventId, userId }) => {
    try {
        Event.deleteOne({ _id: eventId, user: userId })
            .then(() => { }).catch(err => {
                console.log(err.message);
            }
            );
    } catch (error) {
        console.log(error);
    }

};