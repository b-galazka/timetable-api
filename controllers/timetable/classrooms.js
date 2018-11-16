const Classroom = require('../../models/timetable/Classroom');

exports.getAll = async (req, res, next) => {

    try {

        const fields = { number: true, _id: true };

        res.send(await Classroom.loadList(fields));

    } catch (err) {

        next(err);
    }
};

exports.getOneByNumber = async (req, res, next) => {

    try {

        const { number } = req.params;

        const classroom = await Classroom.findOne({ number })

        if (classroom) {

            return res.send(classroom);
        }

        res.status(404).send({ message: 'not found' });

    } catch (err) {

        next(err);
    }
};