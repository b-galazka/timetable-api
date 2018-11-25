const isEqual = require('lodash/isEqual');

class TimetableUpdater {

    constructor(scrappedTimetable) {

        this.scrappedTimetable = scrappedTimetable;
    }

    update() {

        const isScrappedTimtableValid = isEqual(this.scrappedTimetable, {
            teachers: [{}],
            classrooms: [{}],
            schoolClasses: [{}],
            hours: [{}]
        });

        if (isScrappedTimtableValid) {

            return Promise.resolve();
        }

        return Promise.reject(new Error('Invalid scrapped timetable provided'));
    }
}

module.exports = TimetableUpdater;