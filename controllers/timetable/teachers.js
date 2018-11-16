const Teacher = require('../../models/timetable/Teacher');

exports.getAll = async (req, res, next) => {

    try {

        const fields = { slug: true, name: true, _id: true };

        res.send(await Teacher.loadList(fields));

    } catch (err) {

        next(err);
    }
};

exports.getOneBySlug = async (req, res, next) => {

    try {

        const { slug } = req.params;

        const teacher = await Teacher.findOne({ slug });

        if (teacher) {

            return res.send(teacher);
        }

        res.status(404).send({ message: 'not found' });

    } catch (err) {

        next(err);
    }
};