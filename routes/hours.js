const router = require('express').Router();

const controllers = require('../controllers/timetable/hours');
const handleInvalidHttpMethod = require('../middlewares/handleInvalidHttpMethod');

router.get('/', controllers.getAll);

router.all('/', handleInvalidHttpMethod(['GET']));

module.exports = router;