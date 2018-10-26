const MobileApp = require('../../models/MobileApp');
const MobileAppUser = require('../../models/MobileAppUser');

module.exports = {

    async getMobileAppInfo(req, res) {

        try {

            const mobileApp = await MobileApp.findOne();

            res.send(mobileApp || {});

        } catch (err) {

            console.error(err);

            res.status(500).send({ message: 'something went wrong' });
        }
    },

    async updateMobileAppInfo(req, res) {

        try {

            const mobileApp = await MobileApp.createOrUpdate(req.body);

            res.send(mobileApp);

        } catch (err) {

            console.error(err);

            res.status(500).send({ message: 'something went wrong' });
        }
    },

    async putMobileAppUser(req, res) {

        try {

            const user = await MobileAppUser.createOrUpdate(req.body);

            res.send(user);

        } catch (err) {

            console.error(err);

            res.status(500).send({ message: 'something went wrong' });
        }
    }
};