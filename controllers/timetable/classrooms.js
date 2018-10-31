const Classroom = require('../../models/timetable/Classroom');
const catchUnknownError = require('../../middlewares/errorsCatchers/catchUnknownError');

const getAll = catchUnknownError(async (req, res) => {

    res.send(await Classroom.loadList());
});

const getOneByNumber = catchUnknownError(async (req, res) => {

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