const UpdateRequest = require('../../models/timetable/UpdateRequest');

module.exports = async (req, res, next) => {

    try {

        if (await UpdateRequest.canBeProcessed()) {

            return next();
        }

        const { phoneID } = req.body;

        await UpdateRequest.create({
            requestorPhoneID: phoneID,
            timetableUpdated: false
        });

        res.status(403).send({
            message: 'your request cannot be processed, because of time limit'
        });

    } catch (err) {

        next(err);
    }
};