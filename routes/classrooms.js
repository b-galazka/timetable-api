const router = require('express').Router();

const Classroom = require('../models/Classroom');

router.get('/', async (req, res) => {

    try {
        
        res.send(await Classroom.loadList());
    } catch (err) {

        console.error(err);
        
        res.status(500).send({ message: 'something went wrong' });
    }
});

router.get('/:number', async (req, res) => {
    
    try {

        const { number } = req.params;
        
        const classroom = await Classroom.findOne({ number })

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