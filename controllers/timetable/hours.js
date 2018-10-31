const Hour = require('../../models/timetable/Hour');
const catchUnknownError = require('../../middlewares/errorsCatchers/catchUnknownError');

const getAll = catchUnknownError(async (req, res) => {

    res.send(await Hour.loadList());
});

module.exports = {
    getAll
};