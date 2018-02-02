const Joi = require('joi');

module.exports = Joi.object().keys({

    dev: Joi.boolean(),

    phoneModel: Joi.string(),
    phoneID: Joi.string(),
    appVersion: Joi.string(),
    osVersion: Joi.string(),

    mostPopularTimetable: Joi.object().keys({

        type: Joi.string()
            .valid('teacher', 'class', 'classroom'),
            
        slug: Joi.string()
    }).requiredKeys('type', 'slug')
}).requiredKeys('phoneModel', 'phoneID');