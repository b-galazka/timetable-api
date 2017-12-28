const mongoose = require('mongoose');

const timetable = require('./timetable');

const mobileAppUserSchema = new mongoose.Schema({
    
    phoneModel: {
        required: true,
        trim: true,
        type: String
    },
    
    phoneID: {
        required: true,
        trim: true,
        type: String
    },

    mostPopularTimetable: {
        type: timetable,
        default: null
    },
    
    appVersion: {
        type: String,
        trim: true,
        default: null
    },

    lastSeen: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('mobileAppUser', mobileAppUserSchema);