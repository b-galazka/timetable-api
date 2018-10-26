const _ = require('lodash');

const Teacher = require('../models/timetable/Teacher');

class TimetablesComparator {

    constructor(newTeachersTimetable) {

        const { _sortingTeachersCallback } = TimetablesComparator;

        this._newTeachersTimetable = newTeachersTimetable.sort(
            _sortingTeachersCallback
        );

        this._currentTeachersTimetable = null;
    }

    areChangesInTimetable() {

        return (async () => {

            const { _sortingTeachersCallback } = TimetablesComparator;

            const excludedFields = {
                _id: false,
                update: false,
                'timetable._id': false,
                type: false
            };

            const options = {
                sort: { slug: 1 }
            };

            const currentTimetable = await Teacher.find({}, excludedFields, options);

            this._currentTeachersTimetable = currentTimetable;

            const newTimetable = this._newTeachersTimetable;

            return (
                currentTimetable.length !== newTimetable.length ||
                !this._compareTimetables()
            );
        })();
    }

    static _sortingTeachersCallback({ slug: slug1 }, { slug: slug2 }) {

        if (slug1 > slug2) {

            return 1;
        } else if (slug1 === slug2) {

            return 0;
        } else {

            return -1;
        }
    }

    _compareTimetables() {

        const { _compareTimetableObjects } = TimetablesComparator;

        const newTimetable = this._newTeachersTimetable;
        const currentTimetable = this._currentTeachersTimetable;

        for (let i = 0; i < currentTimetable.length; i++) {

            const newTimetableObject = newTimetable[i];
            const currentTimetableObject = currentTimetable[i].toJSON();

            const areObjectsEqual = _compareTimetableObjects(
                newTimetableObject, currentTimetableObject
            );

            if (!areObjectsEqual) {

                return false;
            }
        }

        return true;
    }

    static _compareTimetableObjects(newObject, currentObject) {

        const {
            _compareTimetableObjectsFields,
            _haveTheSameKeys
        } = TimetablesComparator;

        if (!_haveTheSameKeys(newObject, currentObject)) {

            return false;
        }

        for (const key of Object.keys(currentObject)) {

            const newObjectField = newObject[key];
            const currentObjectField = currentObject[key];

            const areFieldsEqual = _compareTimetableObjectsFields(
                newObjectField, currentObjectField
            );

            if (!areFieldsEqual) {

                return false;
            }
        }

        return true;
    }

    static _compareTimetableObjectsFields(newObjectField, currentObjectField) {

        const {
            _compareTimetableObjects,
            _isNullOrUndefined
        } = TimetablesComparator;

        if (
            _isNullOrUndefined(currentObjectField) ||
            _.isEqual(currentObjectField, [null])
        ) {

            return (
                _isNullOrUndefined(newObjectField) ||
                _.isEqual(newObjectField, [null])
            );

        } else if (
            Array.isArray(newObjectField) &&
            Array.isArray(currentObjectField)
        ) {

            return (
                newObjectField.length === currentObjectField.length &&
                _compareTimetableObjects(newObjectField, currentObjectField)
            );
        }

        return _.isEqual(newObjectField, currentObjectField);
    }

    static _isNullOrUndefined(value) {

        return (value === null || value === undefined);
    }

    static _haveTheSameKeys(...objects) {

        const objectsKeys = objects.map(obj => (
            Array.isArray(obj) ?
                _.range(obj.length - 1) :
                Object.keys(obj).sort()
        ));

        return _.isEqual(...objectsKeys);
    }
}

module.exports = TimetablesComparator;