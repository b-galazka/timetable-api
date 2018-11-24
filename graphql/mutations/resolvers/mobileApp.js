const MobileApp = require('../../../models/mobileApp/MobileApp');
const catchUnknownError = require('../../errorsCatchers/catchUnknownError');

exports.createOrUpdate = catchUnknownError((parentValue, args) => MobileApp.createOrUpdate(args));