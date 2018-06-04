const _ = require('lodash');

module.exports = function teacherFindMethod(responseValue) {

    return (critieria, fields, options) => {

        const areCriteriaValid = _.isEqual(critieria, {});

        const areFieldsValid = _.isEqual(fields, {
            _id: false,
            update: false,
            'timetable._id': false,
            type: false
        });

        const areOptionsValid = _.isEqual(options, {
            sort: { slug: 1 }
        });

        if (!areCriteriaValid || !areFieldsValid || !areOptionsValid) {

            throw new Error('Teacher.find called with invalid params');
        }

        const response = responseValue.map((obj, index) => (
            { toJSON: () => responseValue[index] }
        ));

        return Promise.resolve(response);
    };
}