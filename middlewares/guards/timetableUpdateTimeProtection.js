const UpdateRequest = require('../../models/mobileApp/UpdateRequest');
const catchUnknownError = require('../errorsCatchers/catchUnknownError');

module.exports = catchUnknownError(async (req, res, next) => {

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
});