const { User } = require('../../models/users');
const jwt = require('jsonwebtoken');
const { encrypt } = require('./crypt');

module.exports.creatUser = obj => {
    return new Promise((resolve, reject) => {
        User.findOne({ mail: obj.data.mail }, (err, user) => {
            if (err) {
                reject(error.message);
            }
            if (user) {
                reject('User already exist');
            } else {
                const user = new User({
                    name: obj.data.name,
                    lestName: obj.data.lestName,
                    mail: obj.data.mail,
                    password: encrypt(obj.data.password),
                    phone: obj.data.phone,
                });
                user.save().then(data => {
                    const token = jwt.sign({ mail: obj.data.mail, userId: data._id.toString() }, process.env.ENCRYPTED_TOKEN);
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
        User.findOne({ mail: obj.data.mail }, (err, user) => {
            if (err) {
                reject(error.message);
            }
            if (user) {
                const userPassword = encrypt(obj.data.password);
                if (user.password === userPassword) {
                    const token = jwt.sign({ mail: obj.data.mail, userId: user._id.toString() }, process.env.ENCRYPTED_TOKEN);
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
        User.findOne({ mail: obj.data.mail }, (err, user) => {
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
