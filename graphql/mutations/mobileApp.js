const { GraphQLString, GraphQLList } = require('graphql');

const guard = require('../guards');
const authGuard = require('../guards/authGuard');

const { MobileAppType } = require('../types/mobileApp');
const MobileApp = require('../../models/mobileApp/MobileApp');

const createOrUpdate = {
    type: MobileAppType,

    args: {
        version: { type: GraphQLString },
        changelog: { type: new GraphQLList(GraphQLString) },
        message: { type: GraphQLString },
        apkFileUrl: { type: GraphQLString }
    },

    resolve: guard(authGuard, (parentValue, args) => MobileApp.createOrUpdate(args))
};

module.exports = {
    createOrUpdate
};