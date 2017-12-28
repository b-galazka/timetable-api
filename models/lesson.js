const mongoose = require('mongoose');

module.exports = new mongoose.Schema({

    subject: {
        required: true,
        type: String,
        trim: true
    },

    classroom: {
        type: String,
        trim: true
    },

    teacherName: {
        type: String,
        trim: true
    },

    teacherSlug: {
        type: String,
        trim: true
    },

    class: {
        type: String,
        trim: true
    }
});