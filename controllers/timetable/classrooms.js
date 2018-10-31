const Classroom = require('../../models/timetable/Classroom');
const handleUnknownError = require('../../middlewares/handlers/handleUnknownError');

const getAll = handleUnknownError(async (req, res) => {

    res.send(await Classroom.loadList());
});

const getOneByNumber = handleUnknownError(async (req, res) => {

    const { number } = req.params;

    const classroom = await Classroom.findOne({ number })

    if (classroom) {

        res.send(classroom);

    } else {

        res.status(404).send({ message: 'not found' });
    }
});

module.exports = {
    getAll,
    getOneByNumber
};