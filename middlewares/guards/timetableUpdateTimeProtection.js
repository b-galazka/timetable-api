const UpdateRequest = require('../../models/mobileApp/UpdateRequest');
const handleUnknownError = require('../handlers/handleUnknownError');

module.exports = handleUnknownError(async (req, res, next) => {

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
});