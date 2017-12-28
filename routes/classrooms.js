const router = require('express').Router();

const Timetable = require('../classes/Timetable');

router.get('/', async (req, res) => {

    try {
        
        res.send(await Timetable.loadClassroomsList());
    } catch (err) {

        console.error(err);
        
        res.status(500).send({ message: 'something went wrong' });
    }
});

router.get('/:number', async (req, res) => {
    
    try {
        
        const classroom = await Timetable.loadClassroom(req.params.number);

        if (classroom) {

            res.send(classroom);
        } else {

            res.status(404).send({ message: 'not found' });
        }
    } catch (err) {

        console.error(err);
        
        res.status(500).send({ message: 'something went wrong' });
    }
});

module.exports = router;