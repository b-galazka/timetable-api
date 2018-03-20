const mongoose = require('mongoose');

const lessonSchema = require('./schemas/lesson');

const classSchema = new mongoose.Schema(

    {
        slug: {
            required: true,
            type: String,
            trim: true
        },

        type: {
            type: String,
            default: 'class'
        },

        update: {
            type: Date,
            default: Date.now
        },
        
        timetable: [
            [
                [lessonSchema]
            ]
        ]
    },

    { versionKey: false }
);

classSchema.statics = {

    loadList() {

        const fields = {
            slug: true,
            _id: true
        };

        const ordering = {

            sort: {
                slug: 1
            }
        };

        return this.find({}, fields, ordering);
    }
};

module.exports = mongoose.model('class', classSchema);