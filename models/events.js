const { mongoose } = require('../db/mongoose');

const { Schema } = mongoose;

const eventSchema = new Schema({
    eventName: String,
    type: String,
    data: Object,
    user: {
        // required: true,
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

const Event = mongoose.model('Event', eventSchema);


exports.Event = Event;
