const router = require('express').Router();

const Teacher = require('../models/Teacher');

router.get('/', async (req, res) => {

    try {
        
        res.send(await Teacher.loadList());
    } catch (err) {

        console.error(err);
        
        res.status(500).send({ message: 'something went wrong' });
    }
});

router.get('/:slug', async (req, res) => {

    try {

        const { slug } = req.params;
        
        const teacher = await Teacher.findOne({ slug });

        if (teacher) {

            res.send(teacher);
        } else {

            res.status(404).send({ message: 'not found' });
        }
    } catch (err) {

        console.error(err);
        
        res.status(500).send({ message: 'something went wrong' });
    }
});

module.exports = router;