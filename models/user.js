const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    username: {
        required: true,
        type: String,
        trim: true
    },

    password: {
        required: true,
        type: String
    }
});

module.exports = mongoose.model('user', userSchema);