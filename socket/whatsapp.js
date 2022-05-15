const { Client } = require('whatsapp-web.js');
const { User } = require('../models/users');
const io = require('../socket');

class WebWhatsapp {
    constructor({ name, lestName, mail, phone, token, userId, socketId, socket }) {
        this.userId = userId;
        this.name = name;
        this.lestName = lestName;
        this.mail = mail;
        this.phone = phone;
        this.token = token;

        this.socketId = socketId;
        this.socket = socket
        this.client = new Client();
        this.isConnected = false;
    }
    getWhatsappQrCode() {

        try {
            this.client.initialize();
            this.client.on('qr', (qr) => {
                this.socket.emit(`new_qr_for_connectin_id:${this.userId}`, {qrCode: qr});
            });
            this.client.on('ready', () => {
                this.isConnected = true;
                this.client.getContacts().then(contacts => {
                    this.socket.emit(`on_whatsapp_connected_id:${this.userId}`, {contacts: contacts});
                });
                this.client.on('disconnected', (error) => {
                    this.isConnected = false;
                    this.socket.emit(`on_whatsapp_disconnected_id:${this.userId}`, {error: error});
                });
                // console.log('Client is ready!***');
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
    openChannels() {
        this.socket.on(`open_channel_whatsapp_id:${this.userId}`, (data) => {
            if (!this.isConnected) {
                this.getWhatsappQrCode(); 
            }
            // socket.join(data);
            console.log(`open_channel_whatsapp_id:${this.userId}`);
        });

    }
};

// io.getIO().emit('posts', {
//     action: 'create',
//     post: { ...post._doc, creator: { _id: req.userId, name: user.name } }
// });
const startIoConnecting = socket => {
    // socket.on("open_channel_whatsapp", (data) => {
    //     // socket.join(data);
    //     console.log(`User with ID: ${socket.id}`);
    //     new WebWhatsapp({id: socket.id, socketId: socket.id, socket: socket}).getWhatsappQrCode();
    // });

    User.find({}).then(users => {
        users.forEach(user => {
            new WebWhatsapp({
                socketId: socket.id,
                socket: socket,
                userId: user._id.toString(),
                name: user.name,
                lestName: user.lestName,
                mail: user.mail,
                phone: user.phone,
                token: user.token,
            }).openChannels();
        });
    }).catch(err => {
        console.log(err);
    });

};

exports.startIoConnecting = startIoConnecting;

