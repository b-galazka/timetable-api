const Class = require('../../models/timetable/Class');

exports.getAll = async (req, res, next) => {

    try {

        const fields = { slug: true, _id: true };

        res.send(await Class.loadList(fields));

    } catch (err) {

        next(err);
    }
};

exports.getOneBySlug = async (req, res, next) => {

    try {

        const { slug } = req.params;

        const schoolClass = await Class.findOne({ slug });

        if (schoolClass) {

            return res.send(schoolClass);
        }

        res.status(404).send({ message: 'not found' });

    } catch (err) {

        next(err);
    }
};