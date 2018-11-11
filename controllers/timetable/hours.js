const Hour = require('../../models/timetable/Hour');
const catchUnknownError = require('../../middlewares/errorsCatchers/catchUnknownError');

exports.getAll = catchUnknownError(async (req, res) => {

    res.send(await Hour.loadList());
});