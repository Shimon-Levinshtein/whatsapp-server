const fs = require('fs');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const SESSION_FILE_PATH = './session.json';

let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
        session: sessionData
});

client.on('qr', (qr) => {
    // console.log('QR RECEIVED', qr);
    // qrcode.generate(qr, {small: true});
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

client.on('authenticated', (session) => {
    console.log('session..................');
    console.log(session);
    console.log('session-------------------');
    sessionData = session;
    if (session) {
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
});

// client.initialize();
exports.client = client;

