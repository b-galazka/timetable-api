const router = require('express').Router();

const controllers = require('../controllers/hours');
const handleInvalidHttpMethod = require('../middlewares/handleInvalidHttpMethod');

router.get('/', controllers.getAll);

router.all('/', handleInvalidHttpMethod(['GET']));

module.exports = router;