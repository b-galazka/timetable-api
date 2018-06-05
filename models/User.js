const mongoose = require('mongoose');
const crypto = require('crypto');

const { hashSecret } = require('../config');

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

userSchema.statics = {

    _hash(password) {

        return crypto
            .createHmac('sha256', hashSecret)
            .update(password)
            .digest('hex');
    }
};

// create static findByUsernameAndPassoword method
userSchema.pre('findOne', function (next) {

    const { username, password } = this.getQuery();

    if (username) {

        this.where({ username: new RegExp(`^${username.trim()}$`, 'i') })
    }

    if (password) {

        this.where({ password: this.model._hash(password) });
    }

    next();
});

// change pre-save to pre-validate
userSchema.pre('save', function (next) {

    this.password = this.model._hash(this.password);

    next();
});

module.exports = mongoose.model('user', userSchema);