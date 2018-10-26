const UpdateRequest = require('../../models/mobileApp/UpdateRequest');

module.exports = async (req, res, next) => {

    try {

        if (await UpdateRequest.canBeProcessed()) {

            return next();
        }

        res.status(403).send({
            message: 'your request cannot be processed, because of time limit'
        });

        const { phoneID } = req.body;

        await UpdateRequest.create({
            requestorPhoneID: phoneID,
            timetableUpdated: false
        });

    } catch (err) {

        console.error(err);

        if (!res.headersSent) {

            res.status(500).send({ message: 'something went wrong' });
        }
    }
};