const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    content: {
        type: String, 
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    checked: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Item', itemSchema);