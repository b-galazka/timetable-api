const mongoose = require('mongoose');

const hourSchema = new mongoose.Schema(

    {
        start: {
            type: String,
            required: true,
            trim: true
        },

        end: {
            type: String,
            required: true,
            trim: true
        }
    },

    { versionKey: false }
);

hourSchema.statics = {

    async loadList() {

        const hours = await this.find();

        return this._sortHoursAsc(hours);
    },

    _sortHoursAsc(hours) {

        return hours.sort((lessonHour1, lessonHour2) => {

            const [hour1, hour1Minutes] = lessonHour1.start.split(':');
            const [hour2, hour2Minutes] = lessonHour2.start.split(':');

            const hoursDiff = hour1 - hour2;

            if (hoursDiff !== 0) {

                return hoursDiff;
            }

            const minutesDiff = hour1Minutes - hour2Minutes;

            return minutesDiff;
        });
    }
};

module.exports = mongoose.model('hour', hourSchema);