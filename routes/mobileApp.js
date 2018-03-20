const router = require('express').Router();

const MobileApp = require('../models/MobileApp');
const MobileAppUser = require('../models/MobileAppUser');
const authorization = require('../middlewares/authorization');
const mobileAppValidation = require('../middlewares/mobileAppValidation');
const mobileAppUserValidation = require('../middlewares/mobileAppUserValidation');

router.put('/', authorization);
router.put('/', mobileAppValidation);
router.put('/users', authorization);
router.put('/users', mobileAppUserValidation);

router.get('/', async (req, res) => {

    try {

        const mobileApp = await MobileApp.findOne();

        res.send(mobileApp || {});
    } catch (err) {

        console.error(err);

        res.status(500).send({ message: 'something went wrong' });
    }
});

router.put('/', async (req, res) => {

    try {

        const mobileApp = await MobileApp.createOrUpdate(req.body);

        res.send(mobileApp);
    } catch (err) {

        console.error(err);

        res.status(500).send({ message: 'something went wrong' });
    }
});

router.put('/users', async (req, res) => {

    try {

        const user = await MobileAppUser.createOrUpdate(req.body);

        res.send(user);
    } catch (err) {

        console.error(err);

        res.status(500).send({ message: 'something went wrong' });
    }
});

module.exports = router;