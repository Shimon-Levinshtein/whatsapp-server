const { Client } = require('whatsapp-web.js');
const { User } = require('../../models/users');

module.exports.creatUser =  obj => {
    
    return new Promise((resolve, reject) => {
      
      const user = new User(obj.data);
      user.save().then(data => {
          console.log('data-*-*-*-*');
          console.log(data);
        resolve(data);
        }).catch(err => {
            reject(err);
        });
    })
};
