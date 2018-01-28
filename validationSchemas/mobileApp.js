const Joi = require('joi');

const ipOctet = '((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([1-9]?[0-9]))';
const ip = `((${ipOctet}\\.){3}${ipOctet})`;
const port = '(:\\d+)';
const urlVariable = '([\\w]+=[\\w-\\.%]+)';
const urlQuery = `(\\?${urlVariable}(&${urlVariable})*)`;
const protocol = 'https?://';
const domain = '(([\\da-z]+(-[\\da-z]+)*\\.)+[a-z]{2,6})';
const urlPath = '(/([\\w-\.%]+/)*[\\w-\.%]+)';
const urlHash = '(#\\w+)';

const apkFileUrl = `^${protocol}(${ip}|${domain})${port}?(/|${urlPath})?/?${urlQuery}?/?${urlHash}?$`;
const apkFileUrlRegex = new RegExp(apkFileUrl);

module.exports = Joi.object().keys({

    version: Joi.string()
        .regex(/^\d{1,3}\.\d{1,2}$/),

    changelog: Joi.array()
        .items(Joi.string()),

    message: Joi.string()
        .allow(''),

    apkFileUrl: Joi.string()
        .allow('')
        .regex(apkFileUrlRegex, 'valid http(s) URL with domain name or IP')
}).or('version', 'changelog', 'message', 'apkFileUrl');