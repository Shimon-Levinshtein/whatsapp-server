const mapUsers = new Map();
exports.mapUsers = mapUsers;
const { Client } = require('whatsapp-web.js');
const { User } = require('../models/users');
// const io = require('../socket');


const { listenMessages } = require('../evets/inComingMessage/inComingMessage');
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
            this.client.on('ready', e => {
                this.isConnected = true;
                this.client.getContacts().then(contacts => {
                    this.client.getProfilePicUrl(this.client.info.me._serialized).then(imageUrl => {
                        this.socket.emit(`on_whatsapp_connected_id:${this.userId}`, {
                            contacts: contacts,
                            clientInfo: { ...this.client.info, imageUrl },
                        });
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
                this.client.on('disconnected', (error) => {
                    this.isConnected = false;
                    this.countSendQr = 0;
                    this.socket.emit(`on_whatsapp_disconnected_id:${this.userId}`, { error: error });
                });
                this.client.on('message', message => {
                    listenMessages(this.userId, message);
                });
            });
        } catch (error) {
            console.log('error', error);
        };
    };
    openChannels() {
        try {
            if (!this.isConnected && this.countSendQr == 0) {
                this.getWhatsappQrCode();
            }
            this.socket.on('disconnect', () => {
                this.destroySocketEvents();
            });
            this.socket.on(`check_whatsapp_connection_status_id:${this.userId}`, () => {
                this.socket.emit(`res_whatsapp_connection_status_id:${this.userId}`, { status: this.isConnected });
            });
            // this.socket.on(`check_interval_whatsapp_connection_status_id:${this.userId}`, () => {
            //     this.socket.emit(`res_interval_whatsapp_connection_status_id:${this.userId}`, { status: this.isConnected });
            // });
            this.socket.on(`request_qr_code_id:${this.userId}`, () => {
                if (!this.isConnected && this.countSendQr == 0) {
                    this.getWhatsappQrCode();
                }
            });

            this.socket.on(`request_contacts_id:${this.userId}`, () => {
                if (this.isConnected) {
                    this.client.getContacts().then(contacts => {
                        this.client.getProfilePicUrl(this.client.info.me._serialized).then(imageUrl => {
                            this.socket.emit(`response_contacts_id:${this.userId}`, {
                                contacts: contacts,
                                clientInfo: { ...this.client.info, imageUrl },
                            });
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }
            });
            this.socket.on(`request_chats_id:${this.userId}`, () => {
                if (this.isConnected) {
                    const chatHeandler = async () => {

                        const chats = await this.client.getChats();
                        const chatWithMsgPromisArr = chats.map(async chat => {
                            const chats = await chat.fetchMessages();
                            const imageUrl = await this.client.getProfilePicUrl(chat.id._serialized);
                            return { ...chat, chats, imageUrl }
                        });
                        const chatWithMsg = await Promise.all(chatWithMsgPromisArr);
                        this.socket.emit(`response_chats_id:${this.userId}`, {
                            chats: chatWithMsg
                        });
                    };
                    chatHeandler();
                    // chatHeandler.then(data => {
                    //     this.socket.emit(`response_chats_id:${this.userId}`, {
                    //         chats: data,
                    //     });
                    // }).catch(err => console.log(err))


                    // const chatsPromise = new Promise((resolve, reject) => {
                    //     try {

                    //         this.client.getChats().then(chats => {
                    //             const newChats = [];
                    //             chats.forEach(chat => {
                    //                 chat.fetchMessages().then(messages => {
                    //                     this.client.getProfilePicUrl(chat.id._serialized).then(imgUrl => {
                    //                         newChats.push({
                    //                             ...chat,
                    //                             chats: messages,
                    //                             imgUrl: imgUrl ? imgUrl : '',
                    //                         });
                    //                         if (newChats.length == chats.length) {
                    //                             resolve(newChats);
                    //                         };
                    //                     });
                    //                 });
                    //             });
                    //         });
                    //     } catch (error) {
                    //         reject(error)
                    //     }
                    // })
                    // chatsPromise.then(data => {
                    //     this.socket.emit(`response_chats_id:${this.userId}`, {
                    //         chats: data,
                    //     });
                    // }).catch(err => console.log(err))
                };
            });
            this.socket.on(`get_chats_by_chatId_id:${this.userId}`, chatId => {
                const chatsPromise = new Promise((resolve, reject) => {
                    this.client.getChatById(chatId)
                        .then(chat => {
                            chat.fetchMessages().then(messages => {
                                const newChats = [];
                                messages.forEach(async element => {
                                    let media = '';
                                    if (element.hasMedia) {
                                        media = await element.downloadMedia();
                                    }
                                    newChats.push({
                                        ...element,
                                        media: media ? media : 'x',
                                    });
                                    if (newChats.length == messages.length) {
                                        resolve(newChats);
                                    };
                                });

                            }).catch(err => console.log(err))
                        }).catch(err => console.log(err))
                })
                chatsPromise.then(data => {
                    this.socket.emit(`response_chats_by_chatId_id:${this.userId}`, {
                        chat: data,
                        chatId: chatId,
                    });
                }).catch(err => console.log(err))
            });
        } catch (error) {
            console.log('error', error);
        }
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

exports.addUserToWebWhatsapp = (user) => {
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
};

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

