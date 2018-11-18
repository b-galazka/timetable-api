const _ = require('lodash');

class TimetableUpdater {

    constructor(scrappedTimetable) {

        this.scrappedTimetable = scrappedTimetable;
    }

    update() {

        const isScrappedTimtableValid = _.isEqual(this.scrappedTimetable, {
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