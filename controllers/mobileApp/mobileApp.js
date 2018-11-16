const MobileApp = require('../../models/mobileApp/MobileApp');
const MobileAppUser = require('../../models/mobileApp/MobileAppUser');

exports.getMobileAppInfo = async (req, res, next) => {

    try {

        const mobileApp = await MobileApp.findOne();

        res.send(mobileApp || {});

    } catch(err) {

        next(err);
    }
};

exports.updateMobileAppInfo = async (req, res, next) => {

    try {

        const mobileApp = await MobileApp.createOrUpdate(req.body);

        res.send(mobileApp);

    } catch(err) {

        next(err);
    }
};

exports.putMobileAppUser = async (req, res, next) => {

    try {

        const user = await MobileAppUser.createOrUpdate(req.body);

        res.send(user);

    } catch(err) {

        next(err);
    }
};