const mongoose = require('mongoose');

const timetable = require('./schemas/timetable');

const mobileAppUserSchema = new mongoose.Schema(

    {
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
            trim: true
        },

        osVersion: {
            type: String,
            trim: true
        },

        lastSeen: {
            type: Date,
            default: Date.now
        }
    },

    { versionKey: false }
);

mobileAppUserSchema.statics = {

    async createOrUpdate(data) {

        if (!data.phoneID) {

            throw new Error('phoneID field is required');
        }

        const existingUser = await this.findOne({ phoneID: data.phoneID });

        if (!existingUser) {

            return this.create(data);
        }

        const updatedUser = Object.assign(existingUser, data);

        updatedUser.lastSeen = new Date();

        return updatedUser.save();
    }
};

module.exports = mongoose.model('mobileAppUser', mobileAppUserSchema);