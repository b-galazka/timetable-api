const mongoose = require('mongoose');

const lessonSchema = require('./lesson');

const classSchema = new mongoose.Schema({

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
});

module.exports = mongoose.model('class', classSchema);