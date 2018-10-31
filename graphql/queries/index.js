const { GraphQLObjectType } = require('graphql');

const MobileAppQuery = require('./mobileApp');
const TimetableQuery = require('./timetable');

module.exports = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        timetable: TimetableQuery,
        mobileApp: MobileAppQuery
    }
});