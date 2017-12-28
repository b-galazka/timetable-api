const router = require('express').Router();

const getScrappedTimetable = require('../functions/getScrappedTimetable');
const authorization = require('../middlewares/authorization');
const userRequestValidation = require('../middlewares/timetableUpdateUserRequestValidation');
const timeProtection = require('../middlewares/timetableUpdateTimeProtection');
const Timetable = require('../classes/Timetable');
const TimetableScraper = require('../classes/TimetableScraper');
const DocumentsDownloader = require('../classes/DocumentsDownloader');
const UpdateRequest = require('../classes/UpdateRequest');

router.put('/timetable', authorization);
router.put('/request-update', authorization);
router.put('/request-update', userRequestValidation);
router.put('/request-update', timeProtection);

router.put('/timetable', async (req, res) => {

    try {

        const scrappedTimetable = await getScrappedTimetable();
        const timetable = new Timetable(scrappedTimetable);

        await timetable.update();

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

        if (! await UpdateRequest.areChangesInTimetable(scrappedTimetable.teachers)) {

            res.status(403).send({
                message: 'no changes in timetable detected'
            });

            const updateRequest = new UpdateRequest(phoneID, false);

            return await updateRequest.save();
        }

        const timetable = new Timetable(scrappedTimetable);

        await timetable.update();

        res.send({ message: 'updated' });

        const updateRequest = new UpdateRequest(phoneID);

        await updateRequest.save();
    } catch (error) {

        console.error(error);

        if (!res.headersSent) {

            res.status(500).send({ message: 'something went wrong' });
        }
    }
});

module.exports = router;