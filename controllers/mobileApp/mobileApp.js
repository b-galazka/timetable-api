const MobileApp = require('../../models/mobileApp/MobileApp');
const MobileAppUser = require('../../models/mobileApp/MobileAppUser');
const catchUnknownError = require('../../middlewares/errorsCatchers/catchUnknownError');

const getMobileAppInfo = catchUnknownError(async (req, res) => {

    const mobileApp = await MobileApp.findOne();

    res.send(mobileApp || {});
});

const updateMobileAppInfo = catchUnknownError(async (req, res) => {

    const mobileApp = await MobileApp.createOrUpdate(req.body);

    res.send(mobileApp);
});

const putMobileAppUser = catchUnknownError(async (req, res) => {

    const user = await MobileAppUser.createOrUpdate(req.body);

    res.send(user);
});

module.exports = {
    getMobileAppInfo,
    updateMobileAppInfo,
    putMobileAppUser
};