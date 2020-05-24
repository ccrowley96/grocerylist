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
    expireAt: {
        type: Date,
        required: true
  },
    roomList: [Item]
});

// Expire at the time indicated by the expireAt field
roomSchema.index({ expireAt: 1 }, { expireAfterSeconds : 0 });

module.exports = mongoose.model('Room', roomSchema);