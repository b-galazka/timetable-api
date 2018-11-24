const { GraphQLString, GraphQLList } = require('graphql');

const guard = require('../guards');
const authGuard = require('../guards/authorization');
const validationGuard = require('../guards/validation');
const resolvers = require('./resolvers/mobileApp');

const { MobileAppType } = require('../types/mobileApp');
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
        resolvers.createOrUpdate
    )
};