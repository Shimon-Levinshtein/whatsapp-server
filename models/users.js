const { mongoose } = require('../db/mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    lestName: String,
    mail: String,
    password: String,
    phone: String,
    token: String,
    resetPasswordToken: String,
});

const User = mongoose.model('User', userSchema);


exports.User = User;
