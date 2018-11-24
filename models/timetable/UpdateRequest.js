const mongoose = require('mongoose');

const { userUpdateRequestTimeLimit } = require('../../config');

const updateRequestSchema = new mongoose.Schema(

    {
        requestorPhoneID: {
            required: true,
            trim: true,
            type: String
        },

        timetableUpdated: {
            required: true,
            type: Boolean
        },

        dateTime: {
            type: Date,
            default: Date.now
        }
    },

    { versionKey: false }
);

updateRequestSchema.statics = {

    loadNewest() {

        return this.findOne({}, { dateTime: true }, { sort: { _id: -1 } });
    },

    async canBeProcessed(minimalTimePeriod = userUpdateRequestTimeLimit) {

        const lastUpdateRequest = await this.loadNewest();

        if (!lastUpdateRequest) {

            return true;
        }

        const lastUpdateRequestTime = new Date(lastUpdateRequest.dateTime).getTime();
        const currentTime = Date.now();

        return (currentTime - lastUpdateRequestTime > minimalTimePeriod);
    }
};

module.exports = mongoose.model('updateRequest', updateRequestSchema);