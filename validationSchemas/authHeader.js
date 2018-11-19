const Joi = require('joi');

const base64RegexStr = '(?:[a-z0-9+/]{4})*(?:[a-z0-9+/]{2}==|[a-z0-9+/]{3}=|[a-z0-9+/]{4})';
const authHeaderRegex = new RegExp(`^Basic ${base64RegexStr}$`, 'i');

module.exports = Joi.string()
    .label('Authorization header')
    .regex(authHeaderRegex, 'basic auth')
    .required();