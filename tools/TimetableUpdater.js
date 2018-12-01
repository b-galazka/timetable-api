const Teacher = require('../models/timetable/Teacher');
const SchoolClass = require('../models/timetable/Class');
const Classroom = require('../models/timetable/Classroom');
const Hour = require('../models/timetable/Hour');
const Update = require('../models/timetable/Update');

class TimetableUpdater {

    constructor(scrappedTimetable) {

        this.scrappedTimetable = scrappedTimetable;
    }

    save() {

        return (async () => {

            const { teachers, classrooms, schoolClasses, hours } = this.scrappedTimetable;

            await Promise.all([
                Teacher.insertMany(teachers),
                Classroom.insertMany(classrooms),
                SchoolClass.insertMany(schoolClasses),
                Hour.insertMany(hours)
            ]);

            await Update.createOrUpdate({ dateTime: new Date() });
        })();
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