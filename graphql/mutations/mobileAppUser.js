const { GraphQLString, GraphQLBoolean, GraphQLNonNull } = require('graphql');

const guard = require('../guards');
const authGuard = require('../guards/authGuard');

const { MobileAppUserType, InputTimetableType } = require('../types/mobileApp');
const MobileAppUser = require('../../models/mobileApp/MobileAppUser');

const createOrUpdate = {
    type: MobileAppUserType,

    args: {
        dev: { type: GraphQLBoolean },
        phoneModel: { type: new GraphQLNonNull(GraphQLString) },
        phoneID: { type: new GraphQLNonNull(GraphQLString) },
        appVersion: { type: GraphQLString },
        osVersion: { type: GraphQLString },
        mostPopularTimetable: { type: InputTimetableType }
    },

    resolve: guard(authGuard, (parentValue, args) => MobileAppUser.createOrUpdate(args))
};

module.exports = {
    createOrUpdate
};