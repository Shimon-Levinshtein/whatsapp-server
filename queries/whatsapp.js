const { Client } = require('whatsapp-web.js');

module.exports.getWhatsappQrCode = async () => {
    return new Promise((resolve, reject) => {
        try {

            const client = new Client();
            client.initialize();
            client.on('qr', (qr) => {
                console.log('QR RECEIVED', qr);
                resolve(qr);
            });
            client.on('ready', () => {
                console.log('Client is ready!');
                // client.getChats().then(chats => {
                //     console.log('Chats:', chats);
                //     const myGroup = chats.find((group) => group.name === 'test');
                //     const elisheva = chats.find((group) => group.name === 'אלישבע מוגן');
                //     console.log('My group:', myGroup);
                //     // client.sendMessage(elisheva.id._serialized, '...');
                //     // client.sendMessage(myGroup.id._serialized, 'Hello world!');
                // })
            });
        } catch (error) {
            console.log('error!!!!!!!!!!!!!!!!!', error);
            reject(err);

        }
    })
};
