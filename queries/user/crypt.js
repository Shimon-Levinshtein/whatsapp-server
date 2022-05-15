const crypto = require('crypto');

module.exports.encrypt = text => {
    var cipher = crypto.createCipher(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_PASSWORD)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
};
module.exports.decrypt = text => {
    var decipher = crypto.createDecipher(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_PASSWORD)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
};