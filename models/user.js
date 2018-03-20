const mongoose = require('mongoose');

const hash = require('../functions/hash');

const userSchema = new mongoose.Schema(

    {
        username: {
            required: true,
            type: String,
            trim: true
        },

        password: {
            required: true,
            type: String
        }
    },

    { versionKey: false }
);

userSchema.pre('findOne', function (next) {

    const { username, password } = this.getQuery();

    if (username) {

        this.where({ username: new RegExp(`^${username.trim()}$`, 'i') })
    }

    if (password) {

        this.where({ password: hash(password) });
    }

    next();
});

module.exports = mongoose.model('user', userSchema);