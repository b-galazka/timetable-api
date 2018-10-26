const router = require('express').Router();

const authorization = require('../middlewares/authorization');
const userRequestValidation = require('../middlewares/timetableUpdateUserRequestValidation');
const timeProtection = require('../middlewares/timetableUpdateTimeProtection');
const controllers = require('../controllers/update');
const handleInvalidHttpMethod = require('../middlewares/handleInvalidHttpMethod');

router.put('/timetable', authorization);
router.put('/request-update', authorization);
router.put('/request-update', userRequestValidation);
router.put('/request-update', timeProtection);

router.put('/timetable', controllers.updateTimetable);
router.put('/request-update', controllers.handleUserTimetableUpdateRequest);

router.all('/timetable', handleInvalidHttpMethod(['PUT']));
router.all('/request-update', handleInvalidHttpMethod(['PUT']));

module.exports = router;