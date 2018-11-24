const { TimetableType } = require('../types/timetable');
const resolvers = require('./resolvers/timetable');

module.exports = {
    type: TimetableType,
    resolve: resolvers.findTimetable
};