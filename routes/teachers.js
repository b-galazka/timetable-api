const router = require('express').Router();

const controllers = require('../controllers/teachers');

router.get('/', controllers.getAll);
router.get('/:slug', controllers.getOneBySlug);

module.exports = router;