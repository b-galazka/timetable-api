const getScrappedTimetable = require('../../functions/getScrappedTimetable');
const TimetableUpdater = require('../../tools/TimetableUpdater');
const UpdateRequest = require('../../models/mobileApp/UpdateRequest');
const TimetablesComparator = require('../../tools/TimetablesComparator');

module.exports = {

    async updateTimetable(req, res) {

        try {

            const scrappedTimetable = await getScrappedTimetable();
            const timetableUpdater = new TimetableUpdater(scrappedTimetable);

            await timetableUpdater.update();

            res.send({ message: 'updated' });

        } catch (error) {

            console.error(error);

            res.status(500).send({ message: 'something went wrong' });
        }
    },

    async handleUserTimetableUpdateRequest(req, res) {

        try {

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

        } catch (error) {

            console.error(error);

            if (!res.headersSent) {

                res.status(500).send({ message: 'something went wrong' });
            }
        }
    }
};