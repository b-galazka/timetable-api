const Class = require('../../models/timetable/Class');

module.exports = {

    async getAll(req, res) {

        try {

            const fields = {
                slug: true,
                _id: true
            };

            res.send(await Class.loadList(fields));

        } catch (err) {

            console.error(err);

            res.status(500).send({ message: 'something went wrong' });
        }
    },

    async getOneBySlug(req, res) {

        try {

            const { slug } = req.params;

            const schoolClass = await Class.findOne({ slug });

            if (schoolClass) {

                res.send(schoolClass);

            } else {

                res.status(404).send({ message: 'not found' });
            }

        } catch (err) {

            console.error(err);

            res.status(500).send({ message: 'something went wrong' });
        }
    }
};