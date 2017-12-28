const mongoose = require('mongoose');

const lessonSchema = require('./lesson');

const classroomSchema = new mongoose.Schema({

    number: {
        required: true,
        type: String,
        trim: true
    },

    type: {
        type: String,
        default: 'classroom'
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

module.exports = mongoose.model('classroom', classroomSchema);