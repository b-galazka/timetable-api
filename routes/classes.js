const router = require('express').Router();

const Timetable = require('../classes/Timetable');

router.get('/', async (req, res) => {

    try {

        res.send(await Timetable.loadClassesList());
    } catch (err) {

        console.error(err);
        
        res.status(500).send({ message: 'something went wrong' });
    }
});

router.get('/:slug', async (req, res) => {

    try {

        const schoolClass = await Timetable.loadSchoolClass(req.params.slug);

        if (schoolClass) {

            res.send(schoolClass);
        } else {

            res.status(404).send({ message: 'not found' });
        }
    } catch (err) {

        console.error(err);
        
        res.status(500).send({ message: 'something went wrong' });
    }
});

module.exports = router;