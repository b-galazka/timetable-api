const { GraphQLObjectType } = require('graphql');

const { TimetableType } = require('../types/timetable');
const { MobileAppType } = require('../types/mobileApp');

const MobileApp = require('../../models/mobileApp/MobileApp');

// TODO: move single queries to separated files
module.exports = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        timetable: { type: TimetableType, resolve: () => true },

        mobileApp: {
            type: MobileAppType,
            resolve: () => MobileApp.findOne()
        }
    }
});