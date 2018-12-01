const catchUnknownError = require('../../errorsCatchers/catchUnknownError');
const Teacher = require('../../../models/timetable/Teacher');
const Classroom = require('../../../models/timetable/Classroom');
const SchoolClass = require('../../../models/timetable/Class');
const Hour = require('../../../models/timetable/Hour');
const UpdateRequest = require('../../../models/timetable/UpdateRequest');
const Update = require('../../../models/timetable/Update');

// has to return empy object to allow to fetch nested data
exports.findTimetable = () => ({});

exports.findTeachers = catchUnknownError(() => Teacher.loadList());
exports.findClassrooms = catchUnknownError(() => Classroom.loadList());
exports.findSchoolClasses = catchUnknownError(() => SchoolClass.loadList());
exports.findHours = catchUnknownError(() => Hour.loadList());
exports.findUpdateRequests = catchUnknownError(() => UpdateRequest.find());

exports.findSingleTeacher = catchUnknownError((parentValue, args) => {

    const { slug } = args;

    if (slug === undefined) {

        return Teacher.loadFirstOne();
    }

    return Teacher.findOne({ slug });
});

exports.findSingleClassroom = catchUnknownError((parentValue, args) => {

    const { number } = args;
    const criteria = (number === undefined) ? {} : { number };

    return Classroom.findOne(criteria, {}, { sort: { number: 1 } });
});

exports.findSingleSchoolClass = catchUnknownError((parentValue, args) => {

    const { slug } = args;
    const criteria = (slug === undefined) ? {} : { slug };

    return SchoolClass.findOne(criteria, {}, { sort: { slug: 1 } });
});

exports.findLastUpdate = catchUnknownError(async () => {

    const lastUpdate = await Update.findOne();

    return lastUpdate && lastUpdate.dateTime;
});