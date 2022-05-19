const { User } = require('../../models/users');
const jwt = require('jsonwebtoken');
const { encrypt } = require('./crypt');
const { sendGoogleEmailEjs } = require('../../controllers/mail/sendMailEjs');

module.exports.creatUser = obj => {
    return new Promise((resolve, reject) => {
        User.findOne({ mail: obj.data.mail.toLowerCase() }, (err, user) => {
            if (err) {
                reject(error.message);
            }
            if (user) {
                reject('User already exist');
            } else {
                const user = new User({
                    name: obj.data.name,
                    lestName: obj.data.lestName,
                    mail: obj.data.mail.toLowerCase(),
                    password: encrypt(obj.data.password),
                    phone: obj.data.phone,
                });
                user.save().then(data => {
                    const token = jwt.sign({ mail: obj.data.mail.toLowerCase(), userId: data._id.toString() }, process.env.ENCRYPTED_TOKEN);
                    user.update({ token: token })
                        .then(() => {
                            resolve({
                                _id: data._id,
                                name: data.name,
                                lestName: data.lestName,
                                mail: data.mail,
                                phone: data.phone,
                                token: token,
                            });
                            sendGoogleEmailEjs({
                                to: data.mail,
                                subject: 'Welcome',
                                templetName: 'registered',
                                dataTemplet: {
                                    title: 'registered',
                                    message: 'Successfully registered :)',
                                    link: process.env.CLINTE_URL,
                                }
                            });
                        }).catch(err => {
                            reject(error.message);
                        });
                }).catch(err => {
                    reject(error.message);
                });
            }
        });
    });
};
module.exports.login = obj => {
    return new Promise((resolve, reject) => {
        User.findOne({ mail: obj.data.mail.toLowerCase() }, (err, user) => {
            if (err) {
                reject(error.message);
            }
            if (user) {
                const userPassword = encrypt(obj.data.password);
                if (user.password === userPassword) {
                    const token = jwt.sign({ mail: obj.data.mail.toLowerCase(), userId: user._id.toString() }, process.env.ENCRYPTED_TOKEN);
                    user.update({ token: token })
                        .then(() => {
                            resolve({
                                _id: user._id,
                                name: user.name,
                                lestName: user.lestName,
                                mail: user.mail,
                                phone: user.phone,
                                token: token,
                            });
                        }).catch(err => {
                            reject(error.message);
                        });
                } else {
                    reject('Wrong password');
                }
            } else {
                reject('Email does not exist');
            }
        });
    });
};
module.exports.loginRefresh = obj => {
    return new Promise((resolve, reject) => {
        User.findOne({ mail: obj.data.mail.toLowerCase() }, (err, user) => {
            if (err) {
                reject(error.message);
            }
            if (user) {
                let verifyToken
                try {
                    verifyToken = jwt.verify(obj.data.token, process.env.ENCRYPTED_TOKEN);
                } catch (error) {
                    reject(error.message);
                }
                resolve({
                    _id: user._id,
                    name: user.name,
                    lestName: user.lestName,
                    mail: user.mail,
                    phone: user.phone,
                    token: user.token,
                });
            } else {
                reject('Email does not exist');
            }
        });
    });
};
module.exports.sendResetPassword = obj => {
    return new Promise((resolve, reject) => {
        User.findOne({ mail: obj.data.mail.toLowerCase() }, (err, user) => {
            if (err) {
                reject(error.message);
            }
            if (user) {
                const token = jwt.sign({ mail: obj.data.mail.toLowerCase(), userId: user._id.toString() }, process.env.ENCRYPTED_TOKEN, { expiresIn: '1h' });
                user.update({ resetPasswordToken: token })
                    .then(() => {
                        try {
                            sendGoogleEmailEjs({
                                to: user.mail,
                                subject: 'Reset Password',
                                templetName: 'resetPassword',
                                dataTemplet: {
                                    title: 'Reset Password',
                                    message: 'Click the password reset button, the link is only valid for one hour.',
                                    link: `${process.env.CLINTE_URL}/change-password/${user.mail}/${token}`,
                                }
                            });
                            resolve();
                        } catch (error) {
                            reject(error.message);
                        }
                    }).catch(err => {
                        reject(error.message);
                    });
            } else {
                reject('Email does not exist');
            }
        });
    });
};
module.exports.changePassword = obj => {
    return new Promise((resolve, reject) => {
        User.findOne({ mail: obj.data.mail.toLowerCase() }, (err, user) => {
            if (err) {
                reject(error.message);
            }
            if (user) {
                // const token = jwt.sign({ mail: obj.data.mail.toLowerCase(), userId: user._id.toString() }, process.env.ENCRYPTED_TOKEN, { expiresIn: '1h' });
                // user.update({ resetPasswordToken: token })
                //     .then(() => {
                //         try {
                //             sendGoogleEmailEjs({
                //                 to: user.mail,
                //                 subject: 'Reset Password',
                //                 templetName: 'resetPassword',
                //                 dataTemplet: {
                //                     title: 'Reset Password',
                //                     message: 'Click the password reset button, the link is only valid for one hour.',
                //                     link: `${process.env.CLINTE_URL}/change-password/${user.mail}/${token}`,
                //                 }
                //             });
                //             resolve();
                //         } catch (error) {
                //             reject(error.message);
                //         }
                //     }).catch(err => {
                //         reject(error.message);
                //     });
            } else {
                reject('Email does not exist');
            }
        });
    });
};
