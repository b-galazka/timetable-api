const Teacher = require('../../models/timetable/Teacher');
const handleUnknownError = require('../../middlewares/handlers/handleUnknownError');

const getAll = handleUnknownError(async (req, res) => {

    res.send(await Teacher.loadList());
});

const getOneBySlug = handleUnknownError(async (req, res) => {

    const { slug } = req.params;

    const teacher = await Teacher.findOne({ slug });

    if (teacher) {

        res.send(teacher);

    } else {

        res.status(404).send({ message: 'not found' });
    }
});

module.exports = {
    getAll,
    getOneBySlug
};