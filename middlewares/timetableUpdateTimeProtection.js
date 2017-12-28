const UpdateRequest = require('../classes/UpdateRequest');

module.exports = async (req, res, next) => {

    try {

        if (await UpdateRequest.canBeProcessed()) {

            return next();
        }

        res.status(403).send({
            message: 'your request cannot be processed, because of time limit'
        });

        const { phoneID } = req.body;
        const updateRequest = new UpdateRequest(phoneID, false);

        await updateRequest.save();
    } catch (err) {

        console.error(err);

        if (!res.headersSent) {

            res.status(500).send({ message: 'something went wrong' });
        }
    }
};