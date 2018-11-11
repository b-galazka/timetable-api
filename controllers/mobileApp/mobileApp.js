const MobileApp = require('../../models/mobileApp/MobileApp');
const MobileAppUser = require('../../models/mobileApp/MobileAppUser');
const catchUnknownError = require('../../middlewares/errorsCatchers/catchUnknownError');

exports.getMobileAppInfo = catchUnknownError(async (req, res) => {

    const mobileApp = await MobileApp.findOne();

    res.send(mobileApp || {});
});

exports.updateMobileAppInfo = catchUnknownError(async (req, res) => {

    const mobileApp = await MobileApp.createOrUpdate(req.body);

    res.send(mobileApp);
});

exports.putMobileAppUser = catchUnknownError(async (req, res) => {

    const user = await MobileAppUser.createOrUpdate(req.body);

    res.send(user);
});