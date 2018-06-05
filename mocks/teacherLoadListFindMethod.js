const _ = require('lodash');

module.exports = (criteria, fields, options) => {

    const areCriteriaValid = _.isEqual(criteria, {});
    const areFieldsValid = _.isEqual(fields, { slug: true, name: true, _id: true });

    const areOptionsValid = (
        options === null ||
        options === undefined ||
        _.isEqual(options, {})
    );

    if (!areCriteriaValid || !areFieldsValid || !areOptionsValid) {

        throw new Error('Teacher.find called with invalid params');
    }

    return Promise.resolve([
        { name: 'A. Ć' },
        { name: 'G. Ą' },
        { name: null, slug: '#J2' },
        { name: 'B. C' },
        { name: null, slug: '#J1' },
        { name: 'A. A' },
        { name: null, slug: 'BG' },
        { name: null, slug: 'AB' },
    ]);
};