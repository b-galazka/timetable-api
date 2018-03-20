const router = require('express').Router();

const Hour = require('../models/Hour');

router.get('/', async (req, res) => {

    try {
        
        res.send(await Hour.loadList());
    } catch (err) {

        console.error(err);
        
        res.status(500).send({ message: 'something went wrong' });
    }
});

module.exports = router;