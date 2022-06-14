const { mapUsers } = require("../../socket/whatsapp");


exports.replayMessage = ({ serializedId, userId, message }) => {
    try {
        if (mapUsers.has(userId)) {
            const user = mapUsers.get(userId);
            if (user.isConnected) {
                user.client.sendMessage(serializedId, message);
            }
        }
    } catch (error) {
        console.log(error);
    }
};

