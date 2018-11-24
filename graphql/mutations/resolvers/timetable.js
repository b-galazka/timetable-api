const catchUnknownError = require('../../errorsCatchers/catchUnknownError');
const ErrorResponse = require('../../errors/ErrorResponse');
const logger = require('../../../utils/logger');
const getScrappedTimetable = require('../../../functions/getScrappedTimetable');
const TimetableUpdater = require('../../../tools/TimetableUpdater');
const TimetablesComparator = require('../../../tools/TimetablesComparator');
const UpdateRequest = require('../../../models/timetable/UpdateRequest');

exports.updateTimetable = catchUnknownError(async () => {

    const scrappedTimetable = await getScrappedTimetable();
    const timetableUpdater = new TimetableUpdater(scrappedTimetable);

    await timetableUpdater.update();

    return {};
});

exports.requestTimetableUpdate = catchUnknownError(async (parentValue, args) => {

    const { phoneID } = args;
    const scrappedTimetable = await getScrappedTimetable();
    const comparator = new TimetablesComparator(scrappedTimetable.teachers);
    const areChangesInTimetable = await comparator.areChangesInTimetable();

    UpdateRequest
        .create({
            requestorPhoneID: phoneID,
            timetableUpdated: areChangesInTimetable
        })
        .catch(err => logger.error(err));

    if (!areChangesInTimetable) {

        throw new ErrorResponse('no changes in timetable detected', 403);
    }

    const timetableUpdater = new TimetableUpdater(scrappedTimetable);

    await timetableUpdater.update();

    return {};
});