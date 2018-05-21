const Hour = require('../models/Hour');

module.exports = {

    async getAll(req, res) {

        try {

            res.send(await Hour.loadList());
            
        } catch (err) {

            console.error(err);

            res.status(500).send({ message: 'something went wrong' });
        }
    }
};