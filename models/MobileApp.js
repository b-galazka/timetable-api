const mongoose = require('mongoose');

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

mobileAppSchema.statics = {

    async createOrUpdate(data) {

        const existingApp = await this.findOne();

        if (!existingApp) {

            return this.create(data);

        } else {

            const updatedApp = Object.assign(existingApp, data);

            return updatedApp.save();
        }
    }
};

module.exports = mongoose.model('mobileApp', mobileAppSchema);