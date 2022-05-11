const { Client } = require('whatsapp-web.js');
const io = require('../socket');

class WebWhatsapp {
    constructor({id, socketId, socket}) {
        this.id = id;
        this.socketId = socketId;
        this.socket = socket
        this.client = new Client();
    }
    getWhatsappQrCode() {
       
        try {
            const client = this.client;
            this.client.initialize();
            this.client.on('qr', (qr) => {
                console.log('QR RECEIVED***', qr);
                // resolve(qr);
            });
            this.client.on('ready', () => {
                console.log('Client is ready!***');
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
        };
    };
};

// io.getIO().emit('posts', {
//     action: 'create',
//     post: { ...post._doc, creator: { _id: req.userId, name: user.name } }
// });
const startIoConnecting = socket => {
    socket.on("open_channel_whatsapp", (data) => {
        // socket.join(data);
        console.log(`User with ID: ${socket.id}`);
        new WebWhatsapp({id: socket.id, socketId: socket.id, socket: socket}).getWhatsappQrCode();
    });

};

exports.startIoConnecting = startIoConnecting;

