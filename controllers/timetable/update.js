const getScrappedTimetable = require('../../functions/getScrappedTimetable');
const TimetableUpdater = require('../../tools/TimetableUpdater');
const UpdateRequest = require('../../models/mobileApp/UpdateRequest');
const TimetablesComparator = require('../../tools/TimetablesComparator');
const handleUnknownError = require('../../middlewares/handlers/handleUnknownError');

const updateTimetable = handleUnknownError(async (req, res) => {

    const scrappedTimetable = await getScrappedTimetable();
    const timetableUpdater = new TimetableUpdater(scrappedTimetable);

    await timetableUpdater.update();

    res.send({ message: 'updated' });
});

const handleUserTimetableUpdateRequest = handleUnknownError(async (req, res) => {

    const { phoneID } = req.body;
    const scrappedTimetable = await getScrappedTimetable();
    const comparator = new TimetablesComparator(scrappedTimetable.teachers);

    if (! await comparator.areChangesInTimetable()) {

        res.status(403).send({
            message: 'no changes in timetable detected'
        });

        return await UpdateRequest.create({
            requestorPhoneID: phoneID,
            timetableUpdated: false
        });
    }

    const timetableUpdater = new TimetableUpdater(scrappedTimetable);

    await timetableUpdater.update();

    res.send({ message: 'updated' });

    await UpdateRequest.create({
        requestorPhoneID: phoneID,
        timetableUpdated: true
    });
});

module.exports = {
    updateTimetable,
    handleUserTimetableUpdateRequest
};