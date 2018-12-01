const mongoose = require('mongoose');

const { userUpdateRequestTimeLimit } = require('../../config');
const Update = require('./Update');

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

        const lastUpdate = await Update.findOne();

        if (!lastUpdate) {

            return true;

        } else if (!this._isDateTimeOldEnough(lastUpdate.dateTime, minimalTimePeriod)) {

            return false;
        }

        const lastUpdateRequest = await this.loadNewest();

        return (
            !lastUpdateRequest ||
            this._isDateTimeOldEnough(lastUpdateRequest.dateTime, minimalTimePeriod)
        );
    },

    _isDateTimeOldEnough(dateTime, diffFromNow) {

        const dateTimeInMs = new Date(dateTime).getTime();
        const currentTime = Date.now();

        return (currentTime - dateTimeInMs > diffFromNow);
    }
};

module.exports = mongoose.model('updateRequest', updateRequestSchema);