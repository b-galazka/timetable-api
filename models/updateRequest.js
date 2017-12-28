const mongoose = require('mongoose');

const updateRequestSchema = new mongoose.Schema({

    requestorPhoneID: {
        required: true,
        trim: true,
        type: String
    },

    timetableUpdated: {
        required: true,
        type: Boolean
    },

    dateTime: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('updateRequest', updateRequestSchema);