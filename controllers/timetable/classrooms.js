const Classroom = require('../../models/timetable/Classroom');
const catchUnknownError = require('../../middlewares/errorsCatchers/catchUnknownError');

exports.getAll = catchUnknownError(async (req, res) => {

    res.send(await Classroom.loadList());
});

exports.getOneByNumber = catchUnknownError(async (req, res) => {

    const { number } = req.params;

    const classroom = await Classroom.findOne({ number })

    if (classroom) {

        res.send(classroom);

    } else {

        res.status(404).send({ message: 'not found' });
    }
});