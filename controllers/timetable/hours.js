const Hour = require('../../models/timetable/Hour');

exports.getAll = async (req, res, next) => {

    try {

        res.send(await Hour.loadList());

    } catch (err) {

        next(err);
    }
};