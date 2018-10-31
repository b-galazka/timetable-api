const { TimetableType } = require('../types/timetable');

module.exports = {
    type: TimetableType,
    // resolve function must exist here to allow to fetch nested data
    resolve: () => true
};