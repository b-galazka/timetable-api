const MobileApp = require('../../models/mobileApp/MobileApp');
const MobileAppUser = require('../../models/mobileApp/MobileAppUser');
const handleUnknownError = require('../../middlewares/handlers/handleUnknownError');

const getMobileAppInfo = handleUnknownError(async (req, res) => {

    const mobileApp = await MobileApp.findOne();

    res.send(mobileApp || {});
});

const updateMobileAppInfo = handleUnknownError(async (req, res) => {

    const mobileApp = await MobileApp.createOrUpdate(req.body);

    res.send(mobileApp);
});

const putMobileAppUser = handleUnknownError(async (req, res) => {

    const user = await MobileAppUser.createOrUpdate(req.body);

    res.send(user);
});

module.exports = {
    getMobileAppInfo,
    updateMobileAppInfo,
    putMobileAppUser
};