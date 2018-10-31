const Class = require('../../models/timetable/Class');
const handleUnknownError = require('../../middlewares/handlers/handleUnknownError');

const getAll = handleUnknownError(async (req, res) => {

    res.send(await Class.loadList());
});

const getOneBySlug = handleUnknownError(async (req, res) => {

    const { slug } = req.params;

    const schoolClass = await Class.findOne({ slug });

    if (schoolClass) {

        res.send(schoolClass);

    } else {

        res.status(404).send({ message: 'not found' });
    }
});

module.exports = {
    getAll,
    getOneBySlug
};