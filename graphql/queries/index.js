const { GraphQLObjectType } = require('graphql');

const { TimetableType } = require('../types/timetable')

module.exports = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        timetable: { type: TimetableType, resolve: () => true }
    }
});