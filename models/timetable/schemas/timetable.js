const mongoose = require('mongoose');

module.exports = new mongoose.Schema(

    {
        type: {
            type: String,
            required: true,
            trim: true
        },

        slug: {
            type: String,
            required: true,
            trim: true
        }
    },

    { versionKey: false }
);