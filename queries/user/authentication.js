const { User } = require('../../models/users');
const jwt = require('jsonwebtoken');

module.exports.creatUser = obj => {

    return new Promise((resolve, reject) => {
        const token = jwt.sign({ mail:  obj.data.mail } , process.env.ENCRYPTED_TOKEN );
        obj.data['token'] = token;
        User.findOne({ mail: obj.data.mail }, (err, user) => {
            if (err) {
                reject(err);
            }
            if (user) {
                reject('User already exist');
            } else {
                const user = new User(obj.data);
                console.log(user);
                user.save().then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
            }
        });
    });
};
