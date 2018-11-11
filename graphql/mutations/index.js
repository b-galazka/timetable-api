const { GraphQLObjectType } = require('graphql');

const { createOrUpdate: createOrUpdateMobileApp } = require('./mobileApp');
const { createOrUpdate: createOrUpdateMobileAppUser } = require('./mobileAppUser');
const { updateTimetable } = require('./timetable');

module.exports = new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
        createOrUpdateMobileApp,
        createOrUpdateMobileAppUser,
        updateTimetable
    }
});