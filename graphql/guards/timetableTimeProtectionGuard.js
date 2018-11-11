const UpdateRequest = require('../../models/mobileApp/UpdateRequest');

module.exports = async (parentValue, args) => {

    const { phoneID } = args;

    let canTimetableBeUpdated;

    try {

        canTimetableBeUpdated = await UpdateRequest.canBeProcessed();

        if (!canTimetableBeUpdated) {

            await UpdateRequest.create({
                requestorPhoneID: phoneID,
                timetableUpdated: false
            });
        }

    } catch (err) {

        console.error(err);

        throw new Error('something went wrong');
    }

    if (!canTimetableBeUpdated) {

        throw new Error('your request cannot be processed, because of time limit');
    }
};