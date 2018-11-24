const catchUnknownError = require('../../errorsCatchers/catchUnknownError');
const MobileApp = require('../../../models/mobileApp/MobileApp');
const MobileAppUser = require('../../../models/mobileApp/MobileAppUser');
const UpdateRequest = require('../../../models/mobileApp/UpdateRequest');

exports.findMobileApp = catchUnknownError(() => MobileApp.findOne());
exports.findMobileAppUsers = catchUnknownError(() => MobileAppUser.find());
exports.findTimetableUpdateRequests = catchUnknownError(() => UpdateRequest.find());