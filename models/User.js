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
    },

    findByUsernameAndPassword(username, password) {

        return this.findOne({
            username: new RegExp(`^${username.trim()}$`, 'i'),
            password: this._hash(password)
        });
    }
};

userSchema.pre('validate', function (next) {

    this.password = this.schema.statics._hash(this.password);

    next();
});

module.exports = mongoose.model('user', userSchema);