const { TimetableType } = require('../types/timetable');

const guard = require('../guards');
const authGuard = require('../guards/authGuard');
const catchUnknownError = require('../errorsCatchers/catchUnknownError');
const getScrappedTimetable = require('../../functions/getScrappedTimetable');

const TimetableUpdater = require('../../tools/TimetableUpdater');

exports.updateTimetable = {
    type: TimetableType,

    resolve: guard(
        authGuard,

        catchUnknownError(async () => {

            const scrappedTimetable = await getScrappedTimetable();
            const timetableUpdater = new TimetableUpdater(scrappedTimetable);

            await timetableUpdater.update();

            return {};
        })
    )
};