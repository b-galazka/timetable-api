const mongoose = require('mongoose');

const mobileAppSchema = new mongoose.Schema({
    
    version: {
        required: true,
        type: String,
        trim: true
    },

    changelog: {
        type: [String],
        default: []
    },

    message: {
        default: '',
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('mobileApp', mobileAppSchema);