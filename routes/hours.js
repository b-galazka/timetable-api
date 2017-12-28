const router = require('express').Router();

const Timetable = require('../classes/Timetable');

router.get('/', async (req, res) => {

    try {
        
        res.send(await Timetable.loadHoursList());
    } catch (err) {

        console.error(err);
        
        res.status(500).send({ message: 'something went wrong' });
    }
});

module.exports = router;