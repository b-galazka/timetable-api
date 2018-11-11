const router = require('express').Router();

const authorization = require('../middlewares/guards/authorization');
const reqBodyValidation = require('../middlewares/validations/reqBodyValidation');
const controllers = require('../controllers/mobileApp/mobileApp');
const handleInvalidHttpMethod = require('../middlewares/handlers/handleInvalidHttpMethod');
const mobileAppValidationSchema = require('../validationSchemas/mobileApp');
const mobileAppUserValidationSchema = require('../validationSchemas/mobileAppUser');

router.put('/', authorization);
router.put('/', reqBodyValidation(mobileAppValidationSchema));
router.put('/users', authorization);
router.put('/users', reqBodyValidation(mobileAppUserValidationSchema));

router.get('/', controllers.getMobileAppInfo);
router.put('/', controllers.updateMobileAppInfo);
router.put('/users', controllers.putMobileAppUser);

router.all('/', handleInvalidHttpMethod(['GET', 'PUT']));
router.all('/users', handleInvalidHttpMethod('PUT'));

module.exports = router;