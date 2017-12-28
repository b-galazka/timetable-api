const mongoose = require('mongoose');

const lessonSchema = require('./lesson');

const teacherSchema = new mongoose.Schema({
    
    slug: {
        required: true,
        type: String,
        trim: true
    },

    name: {
        type: String,
        trim: true
    },
    
    type: {
        type: String,
        default: 'teacher'
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

module.exports = mongoose.model('teacher', teacherSchema);