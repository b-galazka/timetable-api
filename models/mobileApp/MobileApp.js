const mongoose = require('mongoose');

const createOrUpdate = require('../../functions/createOrUpdateModelMethod');

const mobileAppSchema = new mongoose.Schema(

    {
        version: {
            default: '1.0',
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
        },

        apkFileUrl: {
            type: String,
            trim: true,
            default: ''
        }
    },

    { versionKey: false }
);

mobileAppSchema.statics = { createOrUpdate };

module.exports = mongoose.model('mobileApp', mobileAppSchema);