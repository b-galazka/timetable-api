const router = require('express').Router();

const controllers = require('../controllers/classes');

router.get('/', controllers.getAll);
router.get('/:slug', controllers.getOneBySlug);

module.exports = router;