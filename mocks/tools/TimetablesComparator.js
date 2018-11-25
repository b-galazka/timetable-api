const { isEqual } = require('lodash');

class TimetablesComparator {

    constructor(newTeachersTimetable) {

        this._newTeachersTimetable = newTeachersTimetable;
    }

    areChangesInTimetable() {

        if (isEqual(this._newTeachersTimetable, [{}])) {

            return Promise.resolve(true);
        }

        throw new Error('Invalid timetable provided to Timetables Comparator');
    }
}

module.exports = TimetablesComparator;