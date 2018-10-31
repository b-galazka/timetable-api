const router = require('express').Router();

const controllers = require('../controllers/timetable/teachers');
const handleInvalidHttpMethod = require('../middlewares/handlers/handleInvalidHttpMethod');

router.get('/', controllers.getAll);
router.get('/:slug', controllers.getOneBySlug);

router.all('/', handleInvalidHttpMethod('GET'));
router.all('/:slug', handleInvalidHttpMethod('GET'));

module.exports = router;