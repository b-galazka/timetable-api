const mongoose = require('mongoose');

const createOrUpdate = require('../../functions/createOrUpdateModelMethod');

const updateSchema = new mongoose.Schema(

    {
        dateTime: { type: Date, default: Date.now }
    },

    { versionKey: false }
);

updateSchema.statics = { createOrUpdate };

module.exports = mongoose.model('timetableUpdate', updateSchema);