const router = require('express').Router();

const controllers = require('../controllers/timetable/classes');
const handleInvalidHttpMethod = require('../middlewares/handleInvalidHttpMethod');

router.get('/', controllers.getAll);
router.get('/:slug', controllers.getOneBySlug);

router.all('/', handleInvalidHttpMethod(['GET']));
router.all('/:slug', handleInvalidHttpMethod(['GET']));

module.exports = router;