const router = require('express').Router();

const getScrappedTimetable = require('../functions/getScrappedTimetable');
const authorization = require('../middlewares/authorization');
const userRequestValidation = require('../middlewares/timetableUpdateUserRequestValidation');
const timeProtection = require('../middlewares/timetableUpdateTimeProtection');
const TimetableUpdater = require('../tools/TimetableUpdater');
const TimetableScraper = require('../tools/TimetableScraper');
const DocumentsDownloader = require('../tools/DocumentsDownloader');
const UpdateRequest = require('../models/UpdateRequest');
const TimetablesComparator = require('../tools/TimetablesComparator');

router.put('/timetable', authorization);
router.put('/request-update', authorization);
router.put('/request-update', userRequestValidation);
router.put('/request-update', timeProtection);

router.put('/timetable', async (req, res) => {

    try {

        const scrappedTimetable = await getScrappedTimetable();
        const timetableUpdater = new TimetableUpdater(scrappedTimetable);

        await timetableUpdater.update();

        res.send({ message: 'updated' });
    } catch (error) {

        console.error(error);

        res.status(500).send({ message: 'something went wrong' });
    }
});

router.put('/request-update', async (req, res) => {

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
});

module.exports = router;