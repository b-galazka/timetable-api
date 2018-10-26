const router = require('express').Router();

const controllers = require('../controllers/timetable/classrooms');
const handleInvalidHttpMethod = require('../middlewares/handleInvalidHttpMethod');

router.get('/', controllers.getAll);
router.get('/:number', controllers.getOneByNumber);

router.all('/', handleInvalidHttpMethod(['GET']));
router.all('/:slug', handleInvalidHttpMethod(['GET']));

module.exports = router;