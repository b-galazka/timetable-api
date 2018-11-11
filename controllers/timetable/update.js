const getScrappedTimetable = require('../../functions/getScrappedTimetable');
const TimetableUpdater = require('../../tools/TimetableUpdater');
const UpdateRequest = require('../../models/mobileApp/UpdateRequest');
const TimetablesComparator = require('../../tools/TimetablesComparator');
const catchUnknownError = require('../../middlewares/errorsCatchers/catchUnknownError');

exports.updateTimetable = catchUnknownError(async (req, res) => {

    const scrappedTimetable = await getScrappedTimetable();
    const timetableUpdater = new TimetableUpdater(scrappedTimetable);

    await timetableUpdater.update();

    res.send({ message: 'updated' });
});

exports.handleUserTimetableUpdateRequest = catchUnknownError(async (req, res) => {

    const { phoneID } = req.body;
    const scrappedTimetable = await getScrappedTimetable();
    const comparator = new TimetablesComparator(scrappedTimetable.teachers);
    const areChangesInTimetable = await comparator.areChangesInTimetable();

    if (areChangesInTimetable) {

        const timetableUpdater = new TimetableUpdater(scrappedTimetable);

        await timetableUpdater.update();

        res.send({ message: 'updated' });

    } else {

        res.status(403).send({ message: 'no changes in timetable detected' });
    }

    await UpdateRequest.create({
        requestorPhoneID: phoneID,
        timetableUpdated: areChangesInTimetable
    });
});