const router = require('express').Router();

const authorization = require('../middlewares/authorization');
const mobileAppValidation = require('../middlewares/mobileAppValidation');
const mobileAppUserValidation = require('../middlewares/mobileAppUserValidation');
const controllers = require('../controllers/mobileApp');
const handleInvalidHttpMethod = require('../middlewares/handleInvalidHttpMethod');

router.put('/', authorization);
router.put('/', mobileAppValidation);
router.put('/users', authorization);
router.put('/users', mobileAppUserValidation);

router.get('/', controllers.getMobileAppInfo);
router.put('/', controllers.updateMobileAppInfo);
router.put('/users', controllers.putMobileAppUser);

router.all('/', handleInvalidHttpMethod(['GET', 'PUT']));
router.all('/users', handleInvalidHttpMethod(['PUT']));

module.exports = router;