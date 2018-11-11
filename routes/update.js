const router = require('express').Router();

const authorization = require('../middlewares/guards/authorization');
const reqBodyValidation = require('../middlewares/validations/reqBodyValidation');
const timeProtection = require('../middlewares/guards/timetableUpdateTimeProtection');
const controllers = require('../controllers/timetable/update');
const handleInvalidHttpMethod = require('../middlewares/handlers/handleInvalidHttpMethod');
const userRequestValidationSchema = require('../validationSchemas/timetableUpdateUserRequest');

router.put('/timetable', authorization);
router.put('/request-update', authorization);
router.put('/request-update', reqBodyValidation(userRequestValidationSchema));
router.put('/request-update', timeProtection);

router.put('/timetable', controllers.updateTimetable);
router.put('/request-update', controllers.handleUserTimetableUpdateRequest);

router.all('/timetable', handleInvalidHttpMethod('PUT'));
router.all('/request-update', handleInvalidHttpMethod('PUT'));

module.exports = router;