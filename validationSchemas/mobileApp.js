const Joi = require('joi');

module.exports = Joi.object().keys({

    version: Joi.string()
        .regex(/^\d{1,3}\.\d{1,2}$/, 'valid version format'),

    changelog: Joi.array()
        .items(Joi.string()),

    message: Joi.string()
        .allow(''),

    apkFileUrl: Joi.string()
        .allow('')
        .uri()
}).or('version', 'changelog', 'message', 'apkFileUrl');