const mongoose = require('mongoose');
const Item = require('./item').schema;

const roomSchema = mongoose.Schema({
    roomCode: {
        type: String,
        required: true
    },
    roomName: {
        type: String,
        default: 'New List',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    roomList: [Item]
});

module.exports = mongoose.model('Room', roomSchema);