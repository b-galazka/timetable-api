const { MobileAppType } = require('../types/mobileApp');
const MobileApp = require('../../models/mobileApp/MobileApp');
const catchUnknownError = require('../errorsCatchers/catchUnknownError');

module.exports = {
    type: MobileAppType,
    resolve: catchUnknownError(() => MobileApp.findOne())
};