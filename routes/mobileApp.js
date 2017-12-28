const router = require('express').Router();

const MobileApp = require('../classes/MobileApp');
const MobileAppUser = require('../classes/MobileAppUser');
const authorization = require('../middlewares/authorization');
const mobileAppValidation = require('../middlewares/mobileAppValidation');
const mobileAppUserValidation = require('../middlewares/mobileAppUserValidation');

router.put('/', authorization);
router.put('/', mobileAppValidation);
router.put('/users', authorization);
router.put('/users', mobileAppUserValidation);

router.get('/', async (req, res) => {

    try {

        const mobileApp = await MobileApp.loadData();

        res.send(mobileApp);
    } catch (err) {

        console.error(err);

        res.status(500).send({ message: 'something went wrong' });
    }
});

router.put('/', async (req, res) => {

    try {

        const mobileApp = new MobileApp(req.body);

        res.send(await mobileApp.save());
    } catch (err) {

        console.error(err);

        res.status(500).send({ message: 'something went wrong' });
    }
});

router.put('/users', async (req, res) => {

    try {

        const user = new MobileAppUser(req.body);

        res.send(await user.save());
    } catch (err) {

        console.error(err);

        res.status(500).send({ message: 'something went wrong' });
    }
});

module.exports = router;