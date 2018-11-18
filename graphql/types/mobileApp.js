const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLBoolean,
    GraphQLInputObjectType,
    GraphQLNonNull
} = require('graphql');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLObjectId = require('./objectId');

const MobileAppUser = require('../../models/mobileApp/MobileAppUser');
const UpdateRequest = require('../../models/mobileApp/UpdateRequest');

const guard = require('../guards');
const authGuard = require('../guards/authGuard');
const catchUnknownError = require('../errorsCatchers/catchUnknownError');

const TimetableType = new GraphQLObjectType({
    name: 'MobileAppTimetable',
    fields: () => ({
        _id: { type: GraphQLObjectId },
        type: { type: GraphQLString },
        slug: { type: GraphQLString }
    })
});

const InputTimetableType = new GraphQLInputObjectType({
    name: 'InputMobileAppTimetable',
    fields: () => ({
        type: { type: new GraphQLNonNull(GraphQLString) },
        slug: { type: new GraphQLNonNull(GraphQLString) }
    })
});

const UpdateRequestType = new GraphQLObjectType({
    name: 'UpdateRequestType',
    fields: () => ({
        _id: { type: GraphQLObjectId },
        requestorPhoneID: { type: GraphQLString },
        timetableUpdated: { type: GraphQLBoolean },
        dateTime: { type: GraphQLDateTime }
    })
});

const MobileAppUserType = new GraphQLObjectType({
    name: 'MobileAppUser',
    fields: () => ({
        _id: { type: GraphQLObjectId },
        phoneModel: { type: GraphQLString },
        phoneID: { type: GraphQLString },
        mostPopularTimetable: { type: TimetableType },
        appVersion: { type: GraphQLString },
        osVersion: { type: GraphQLString },
        lastSeen: { type: GraphQLDateTime }
    })
});

const MobileAppType = new GraphQLObjectType({
    name: 'MobileApp',
    fields: () => ({
        _id: { type: GraphQLObjectId },
        version: { type: GraphQLString },
        changelog: { type: new GraphQLList(GraphQLString) },
        message: { type: GraphQLString },
        apkFileUrl: { type: GraphQLString },

        users: {
            type: new GraphQLList(MobileAppUserType),
            resolve: catchUnknownError(guard(authGuard, () => MobileAppUser.find()))
        },

        updateRequests: {
            type: new GraphQLList(UpdateRequestType),
            resolve: catchUnknownError(guard(authGuard, () => UpdateRequest.find()))
        }
    })
});

module.exports = {
    MobileAppUserType,
    MobileAppType,
    UpdateRequestType,
    InputTimetableType
};