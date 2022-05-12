const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://whatsappWebDB:${process.env.PASSWORD_MONGOOSE}@cluster0.cojo6.mongodb.net/whatsappWebDB?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch(err => {
        console.log('Error connecting to MongoDB:', err);
    });

module.exports = mongoose;

// user: whatsappWebDB
//password: whatsappserver123