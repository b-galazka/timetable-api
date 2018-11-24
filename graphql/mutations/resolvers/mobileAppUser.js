const MobileAppUser = require('../../../models/mobileApp/MobileAppUser');
const catchUnknownError = require('../../errorsCatchers/catchUnknownError');

exports.createOrUpdate = catchUnknownError(
    (parentValue, args) => MobileAppUser.createOrUpdate(args)
);