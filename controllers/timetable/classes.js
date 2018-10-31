const Class = require('../../models/timetable/Class');
const catchUnknownError = require('../../middlewares/errorsCatchers/catchUnknownError');

const getAll = catchUnknownError(async (req, res) => {

    const fields = {
        slug: true,
        _id: true
    };

    res.send(await Class.loadList(fields));
});

const getOneBySlug = catchUnknownError(async (req, res) => {

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