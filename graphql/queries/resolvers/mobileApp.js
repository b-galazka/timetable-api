const catchUnknownError = require('../../errorsCatchers/catchUnknownError');
const MobileApp = require('../../../models/mobileApp/MobileApp');
const MobileAppUser = require('../../../models/mobileApp/MobileAppUser');

exports.findMobileApp = catchUnknownError(() => MobileApp.findOne());
exports.findMobileAppUsers = catchUnknownError(() => MobileAppUser.find());