const nodemailer = require('nodemailer');
const { google } = require('googleapis');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const OAuth2 = google.auth.OAuth2;

const OAuth2_client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID_EMAIL,
    process.env.GOOGLE_CLIENT_SECRET_EMAIL,
);


OAuth2_client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN_EMAIL })

const sendGoogleEmail = (to, subject, text, html) => {
    const accessToken = OAuth2_client.getAccessToken();

    const transporter = nodemailer.createTransport({
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

    const mailOptions = {
        from: process.env.MAIL_NANAGEMENT,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('****************************************************************************');
            console.log(error);
            console.log(error.message);
            console.log('//////////////////////////////////////////////////////////////////////////////');
        } else {
            console.log('Email sent: ' + info.response);
            console.log('The email sented!');
            console.log(info);
        }
    });

};

// sendGoogleEmail(
//     'shimonwebdeveloper@gmail.com',
//      'Test OA2',
//       'text ......',
//        `<h1>this is tag h1 ***</h1>`
//   );

exports.sendGoogleEmail = sendGoogleEmail;

