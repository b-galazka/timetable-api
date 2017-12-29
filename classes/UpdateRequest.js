const _ = require('lodash');

const updateRequestModel = require('../models/updateRequest');
const TeacherModel = require('../models/teacher');
const Teacher = require('./TimetableScraper/timetableObjects/Teacher');
const { userUpdateRequestTimeLimit } = require('../config');

class UpdateRequest {

    constructor(requestor, timetableUpdated = true) {

        this.requestor = requestor;
        this.timetableUpdated = timetableUpdated;
    }

    save() {

        return updateRequestModel.create({ 
            requestorPhoneID: this.requestor,
            timetableUpdated: this.timetableUpdated
        });
    }

    static async canBeProcessed() {

        const lastUpdateRequest = await updateRequestModel.findOne(
            {},
            { dateTime: true },
            { sort: { id: -1 } }
        );

        if (!lastUpdateRequest) {

            return true;
        }

        const lastUpdateRequestTime = new Date(lastUpdateRequest.dateTime).getTime();
        const currentTime = Date.now();

        return (currentTime - lastUpdateRequestTime > userUpdateRequestTimeLimit);
    }

    static async areChangesInTimetable(teachersTimetable) {

        const { _sortingTeachersCallback, _compareTimetables } = UpdateRequest;

        const excludedFields = {
            _id: false,
            __v: false,
            update: false,
            'timetable._id': false,
            'timetable.__v': false,
            type: false
        };

        const oldTeachersTimetable = await TeacherModel.find({}, excludedFields);

        return (
            teachersTimetable.length !== oldTeachersTimetable.length ||

            !_compareTimetables(
                teachersTimetable.sort(_sortingTeachersCallback),
                oldTeachersTimetable.sort(_sortingTeachersCallback)
            )
        );
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

    static _compareTimetables(newTimetable, currentTimetable) {

        const { _compareTimetableObjects } = UpdateRequest;

        for (let i = 0; i < currentTimetable.length; i++) {

            const newTimetableObject = newTimetable[i];
            const currentTimetableObject = currentTimetable[i].toJSON();

            if (!_compareTimetableObjects(newTimetableObject, currentTimetableObject)) {

                return false;
            }
        }

        return true;
    }

    static _compareTimetableObjects(newObject, currentObject) {

        const { _compareTimetableObjects, _isNullOrUndefined, _haveTheSameKeys } = UpdateRequest;
        
        if (!_haveTheSameKeys(newObject, currentObject)) {

            return false;
        }

        for (const key of Object.keys(currentObject)) {

            const newObjectField = newObject[key];
            const currentObjectField = currentObject[key];

            if (typeof newObjectField !== 'object' && typeof currentObjectField !== 'object') {

                if (!_.isEqual(newObjectField, currentObjectField)) {

                    return false;
                }

                continue;
            }

            if (_isNullOrUndefined(currentObjectField) || _.isEqual(currentObjectField, [null])) {

                if (!_isNullOrUndefined(newObjectField) && !_.isEqual(newObjectField, [null])) {

                    return false;
                }

                continue;
            }

            if (Array.isArray(newObjectField) && Array.isArray(currentObjectField)) {

                if (
                    newObjectField.length !== currentObjectField.length ||
                    !_compareTimetableObjects(newObjectField, currentObjectField)
                ) {

                    return false;
                }

                continue;
            }

            if (!_.isEqual(newObjectField, currentObjectField)) {

                return false;
            }
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

module.exports = UpdateRequest;