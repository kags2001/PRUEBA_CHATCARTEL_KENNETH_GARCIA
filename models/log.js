const {Schema, model} = require('mongoose');

const LogSchema = new Schema({
    userId: {
        type: Number,
        required: true,
    },
    action: {
        type: String,
        enum: ['create', 'update', 'delete','find'],
        required: true,
    },
    resource: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});


module.exports = model('Log', LogSchema);