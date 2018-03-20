const _ = require('lodash');

const Teacher = require('../models/Teacher');

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

            const currentTeachersTimetable = await Teacher.find(
                {}, excludedFields
            );
            
            this._currentTeachersTimetable = currentTeachersTimetable.sort(
                _sortingTeachersCallback
            );

            const currentTimetable = this._currentTeachersTimetable;
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
            typeof newObjectField !== 'object' &&
            typeof currentObjectField !== 'object'
        ) {

            if (!_.isEqual(newObjectField, currentObjectField)) {

                return false;
            }

        } else if (
            _isNullOrUndefined(currentObjectField) ||
            _.isEqual(currentObjectField, [null])
        ) {

            if (
                !_isNullOrUndefined(newObjectField) &&
                !_.isEqual(newObjectField, [null])
            ) {

                return false;
            }

        } else if (
            Array.isArray(newObjectField) &&
            Array.isArray(currentObjectField)
        ) {

            if (
                newObjectField.length !== currentObjectField.length ||
                !_compareTimetableObjects(newObjectField, currentObjectField)
            ) {

                return false;
            }

        } else if (!_.isEqual(newObjectField, currentObjectField)) {

            return false;
        }

        return true;
    }

    static _isNullOrUndefined(value) {

        return (value === null || value === undefined);
    }

    static _haveTheSameKeys(object1, object2) {

        const object1Keys = (
            Array.isArray(object1) ?
                _.range(object1.length - 1) :
                Object.keys(object1).sort()
        );

        const object2Keys = (
            Array.isArray(object2) ?
                _.range(object2.length - 1) :
                Object.keys(object2).sort()
        );

        return _.isEqual(object1Keys, object2Keys);
    }
}

module.exports = TimetablesComparator;