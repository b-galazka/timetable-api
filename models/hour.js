const mongoose = require('mongoose');

const hourSchema = new mongoose.Schema({

    start: {
        type: String,
        required: true,
        trim: true
    },

    end: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('hour', hourSchema);