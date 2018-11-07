const { GraphQLString, GraphQLList } = require('graphql');

const guard = require('../guards');
const authGuard = require('../guards/authGuard');
const validationGuard = require('../guards/validationGuard');

const { MobileAppType } = require('../types/mobileApp');
const MobileApp = require('../../models/mobileApp/MobileApp');
const mobileAppValidationSchema = require('../../validationSchemas/mobileApp');

const createOrUpdate = {
    type: MobileAppType,

    args: {
        version: { type: GraphQLString },
        changelog: { type: new GraphQLList(GraphQLString) },
        message: { type: GraphQLString },
        apkFileUrl: { type: GraphQLString }
    },

    resolve: guard(
        [authGuard, validationGuard(mobileAppValidationSchema)],
        (parentValue, args) => MobileApp.createOrUpdate(args)
    )
};

module.exports = {
    createOrUpdate
};