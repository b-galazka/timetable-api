const router = require('express').Router();

const controllers = require('../controllers/classrooms');

router.get('/', controllers.getAll);
router.get('/:number', controllers.getOneByNumber);

module.exports = router;