const router = require('express').Router();

const Class = require('../models/Class');

router.get('/', async (req, res) => {

    try {

        res.send(await Class.loadList());
    } catch (err) {

        console.error(err);
        
        res.status(500).send({ message: 'something went wrong' });
    }
});

router.get('/:slug', async (req, res) => {

    try {

        const { slug } = req.params;

        const schoolClass = await Class.findOne({ slug });

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