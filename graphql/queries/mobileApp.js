const { MobileAppType } = require('../types/mobileApp');

const MobileApp = require('../../models/mobileApp/MobileApp');

module.exports = {
    type: MobileAppType,
    resolve: () => MobileApp.findOne()
};