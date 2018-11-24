const { MobileAppType } = require('../types/mobileApp');
const resolvers = require('./resolvers/mobileApp');

module.exports = {
    type: MobileAppType,
    resolve: resolvers.findMobileApp
};