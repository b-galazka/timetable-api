const Classroom = require('../../models/timetable/Classroom');

module.exports = {

    async getAll(req, res) {

        try {

            const fields = {
                number: true,
                _id: true
            };

            res.send(await Classroom.loadList(fields));

        } catch (err) {

            console.error(err);

            res.status(500).send({ message: 'something went wrong' });
        }
    },

    async getOneByNumber(req, res) {

        try {

            const { number } = req.params;

            const classroom = await Classroom.findOne({ number })

            if (classroom) {

                res.send(classroom);

            } else {

                res.status(404).send({ message: 'not found' });
            }

        } catch (err) {

            console.error(err);

            res.status(500).send({ message: 'something went wrong' });
        }
    }
};