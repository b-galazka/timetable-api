const UpdateRequest = require('../../models/timetable/UpdateRequest');
const ErrorResponse = require('../errors/ErrorResponse');

const catchUnknownError = require('../errorsCatchers/catchUnknownError');

module.exports = catchUnknownError(async (parentValue, args) => {

    if (await UpdateRequest.canBeProcessed()) {

        return;
    }

    const { phoneID } = args;

    await UpdateRequest.create({
        requestorPhoneID: phoneID,
        timetableUpdated: false
    });

    throw new ErrorResponse('your request cannot be processed, because of time limit', 403);
});