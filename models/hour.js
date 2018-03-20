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

    loadList() {

        const ordering = {

            sort: {
                _id: 1
            }
        };

        return this.find({}, {}, ordering);
    }
};

module.exports = mongoose.model('hour', hourSchema);