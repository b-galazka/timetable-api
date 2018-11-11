const { GraphQLString, GraphQLList } = require('graphql');

const guard = require('../guards');
const authGuard = require('../guards/authGuard');
const validationGuard = require('../guards/validationGuard');
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