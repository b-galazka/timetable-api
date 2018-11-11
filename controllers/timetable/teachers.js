const Teacher = require('../../models/timetable/Teacher');
const catchUnknownError = require('../../middlewares/errorsCatchers/catchUnknownError');

exports.getAll = catchUnknownError(async (req, res) => {

    const fields = {
        slug: true,
        name: true,
        _id: true
    };

    res.send(await Teacher.loadList(fields));
});

exports.getOneBySlug = catchUnknownError(async (req, res) => {

    const { slug } = req.params;

    const teacher = await Teacher.findOne({ slug });

    if (teacher) {

        res.send(teacher);

    } else {

        res.status(404).send({ message: 'not found' });
    }
});