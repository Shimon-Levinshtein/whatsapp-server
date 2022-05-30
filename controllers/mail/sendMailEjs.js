const nodemailer = require('nodemailer');
const ejs = require('ejs');
const { google } = require('googleapis');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const OAuth2 = google.auth.OAuth2;

const OAuth2_client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID_EMAIL,
    process.env.GOOGLE_CLIENT_SECRET_EMAIL,
);


OAuth2_client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN_EMAIL })

const sendGoogleEmail = async ({ to, subject, templetName, dataTemplet }) => {
    try {
        const accessToken = await OAuth2_client.getAccessToken();

        const transporter = await nodemailer.createTransport({
            servise: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_NANAGEMENT,
                clientId: process.env.GOOGLE_CLIENT_ID_EMAIL,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET_EMAIL,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN_EMAIL,
                accessToken: accessToken,
            }
        });

        const ejsTemplate = await ejs.renderFile(`${__dirname}/views/${templetName}/${templetName}.ejs`, dataTemplet);

        const mailOptions = {
            from: process.env.MAIL_NANAGEMENT,
            to: to,
            subject: subject,
            html: ejsTemplate
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('****************************************************************************');
                console.log(error);
                console.log('//////////////////////////////////////////////////////////////////////////////');
            } else {
                console.log('Email sent: ' + info.response);
                console.log('The email sented!');
                console.log(info);
            }
        });
    } catch (error) {
        console.log('sendGoogleEmail - error');
        console.log(error);
    }

};

// sendGoogleEmailEjs({
//     to: 'shimonwebdeveloper@gmail.com',
//      subject: 'test ejs',
//      templetName: 'index',
//       dataTemplet: {
//         title: 'new title'
//       }
//   });

exports.sendGoogleEmailEjs = sendGoogleEmail;

