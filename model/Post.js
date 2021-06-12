const mongoose = require('mongoose');


const newpost = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 2
    },
    post: {
        type: String,
        required: true,
        min: 6,
        max: 4096
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', newpost);
