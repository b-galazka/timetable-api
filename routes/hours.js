const router = require('express').Router();

const controllers = require('../controllers/hours');

router.get('/', controllers.getAll);

module.exports = router;