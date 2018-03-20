const Teacher = require('../models/Teacher');
const SchoolClass = require('../models/Class');
const Classroom = require('../models/Classroom');
const Hour = require('../models/Hour');

class TimetableUpdater {

    constructor(scrappedTimetable) {

        this.scrappedTimetable = scrappedTimetable;
    }

    save() {

        const {
            teachers,
            classrooms,
            schoolClasses,
            hours
        } = this.scrappedTimetable;

        return Promise.all([
            Teacher.insertMany(teachers),
            Classroom.insertMany(classrooms),
            SchoolClass.insertMany(schoolClasses),
            Hour.insertMany(hours)
        ]);
    }

    update() {

        return (async () => {

            await TimetableUpdater.drop();

            await this.save();
        })();
    }

    static drop() {

        const models = [Teacher, Classroom, SchoolClass, Hour];

        const promises = models.map(model => (
            new Promise((resolve) => {

                model.collection.drop(() => resolve());
            })
        ));

        return Promise.all(promises);
    }
}

module.exports = TimetableUpdater;