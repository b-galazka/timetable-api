const getScrappedTimetable = require('../../functions/getScrappedTimetable');
const TimetableUpdater = require('../../tools/TimetableUpdater');
const UpdateRequest = require('../../models/timetable/UpdateRequest');
const TimetablesComparator = require('../../tools/TimetablesComparator');
const Update = require('../../models/timetable/Update');

exports.updateTimetable = async (req, res, next) => {

    try {

        const scrappedTimetable = await getScrappedTimetable();
        const timetableUpdater = new TimetableUpdater(scrappedTimetable);

        await timetableUpdater.update();

        res.send({ message: 'updated' });

    } catch (err) {

        next(err);
    }
};

exports.handleUserTimetableUpdateRequest = async (req, res, next) => {

    try {

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

    } catch (err) {

        next(err);
    }
};

exports.getLastUpdate = async (req, res, next) => {

    try {

        const lastUpdate = await Update.findOne();

        if (lastUpdate) {

            return res.send(lastUpdate);
        }

        res.status(404).send({ message: 'not found' });

    } catch (err) {

        next(err);
    }
};