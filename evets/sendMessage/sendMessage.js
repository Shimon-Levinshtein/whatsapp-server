const { mapUsers } = require('../../socket/whatsapp');

exports.sendMessage = ({ eventId, eventData, userId }) => {
    
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
                eventData.groupList.forEach(cont => {
                    let result = false;
                    if (cont.name) {
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
                    console.log('contactToSend.....................................................');
                    console.log(contactToSend);
                    user.client.sendMessage(contactToSend.id._serialized, eventData.message);
                });
                user.socket.emit(`response_event_ended_id:${userId}`, {
                     eventId: eventId,
                     type: eventData.type,
                     });
            });
        }
};

