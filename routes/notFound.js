const router = require('express').Router();

const controllers = require('../controllers/notFound');

router.all('/*', controllers.responseWithNotFoundMessage);

module.exports = router;