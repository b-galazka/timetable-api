const { GraphQLString, GraphQLList } = require('graphql');

const guard = require('../guards');
const authGuard = require('../guards/authorization');
const validationGuard = require('../guards/validation');
const catchUnknownError = require('../errorsCatchers/catchUnknownError');

const { MobileAppType } = require('../types/mobileApp');
const MobileApp = require('../../models/mobileApp/MobileApp');
const mobileAppValidationSchema = require('../../validationSchemas/mobileApp');

exports.createOrUpdate = {
    type: MobileAppType,

    args: {
        version: { type: GraphQLString },
        changelog: { type: new GraphQLList(GraphQLString) },
        message: { type: GraphQLString },
        apkFileUrl: { type: GraphQLString }
    },

    resolve: guard(
        [authGuard, validationGuard(mobileAppValidationSchema)],
        catchUnknownError((parentValue, args) => MobileApp.createOrUpdate(args))
    )
};