const Hour = require('../../models/timetable/Hour');
const handleUnknownError = require('../../middlewares/handlers/handleUnknownError');

const getAll = handleUnknownError(async (req, res) => {

    res.send(await Hour.loadList());
});

module.exports = {
    getAll
};