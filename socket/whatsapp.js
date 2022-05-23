const { Client } = require('whatsapp-web.js');
const { User } = require('../models/users');
// const io = require('../socket');


const mapUsers = new Map();
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
        this.client = '';
        this.isConnected = false;
        this.countSendQr = 0;
    }
    getWhatsappQrCode() {

        try {
            this.client = new Client();
            this.client.initialize();
            this.client.on('qr', (qr) => {
                this.socket.emit(`new_qr_for_connectin_id:${this.userId}`, { qrCode: qr });
                this.countSendQr++;
                console.log('QR RECEIVED', qr);
                console.log('countSendQr -->> ', this.countSendQr);
                if (this.countSendQr > 1) {
                    console.log('this.client.destroy()');
                    this.client.destroy();
                    this.countSendQr = 0;
                    this.socket.emit(`on_whatsapp_disconnected_id:${this.userId}`, {});
                }
            });
            this.client.on('ready', () => {
                this.isConnected = true;
                this.client.getContacts().then(contacts => {
                    this.socket.emit(`on_whatsapp_connected_id:${this.userId}`, { contacts: contacts });
                });
                this.client.on('disconnected', (error) => {
                    this.isConnected = false;
                    this.countSendQr = 0;
                    this.socket.emit(`on_whatsapp_disconnected_id:${this.userId}`, { error: error });
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
            console.log('error', error);
        };
    };
    openChannels() {
        if (!this.isConnected && this.countSendQr == 0) {
            this.getWhatsappQrCode();
        }
        this.socket.on('disconnect', () => {
            this.destroySocketEvents();
        });
        this.socket.on(`check_whatsapp_connection_status_id:${this.userId}`, () => {
            this.socket.emit(`res_whatsapp_connection_status_id:${this.userId}`, { status: this.isConnected });
        });
        this.socket.on(`check_interval_whatsapp_connection_status_id:${this.userId}`, () => {
            this.socket.emit(`res_interval_whatsapp_connection_status_id:${this.userId}`, { status: this.isConnected });
        });
        this.socket.on(`request_qr_code_id:${this.userId}`, () => {
            if (!this.isConnected && this.countSendQr == 0) {
                this.getWhatsappQrCode();
            }
        });
        
        this.socket.on(`request_contacts_id:${this.userId}`, () => {
            this.client.getContacts().then(contacts => {
                this.socket.emit(`response_contacts_id:${this.userId}`, { contacts: contacts });
            });
        });
    };
    changeSocket(socket) {
        if (this.socketId !== socket.id) {
            if (this.socketId) {
                this.socket.emit(`another_socket_we_enter_id:${this.userId}`, {});
            };
            this.socket = socket;
            this.socketId = socket.id;
            this.openChannels();
        }
    };
    destroySocketEvents = () => {
        if (!this.isConnected) {
            this.client.destroy();
            this.countSendQr = 0;
        }
    };

};

User.find({}).then(users => {
    users.forEach(user => {
        const userClass = new WebWhatsapp({
            socketId: '',
            socket: '',
            userId: user._id.toString(),
            name: user.name,
            lestName: user.lestName,
            mail: user.mail,
            phone: user.phone,
            token: user.token,
        });
        mapUsers.set(user._id.toString(), userClass);
    });
}).catch(err => {
    console.log(err);
});

const startIoConnecting = socket => {
    try {
        socket.on(`open_channel_whatsapp`, (data) => {
            const userId = data._id;
            if (mapUsers.has(userId)) {
                const userClass = mapUsers.get(userId);
                userClass.changeSocket(socket);
            }
        });
    } catch (error) {
        console.log('error', error);
    };
};

exports.startIoConnecting = startIoConnecting;

