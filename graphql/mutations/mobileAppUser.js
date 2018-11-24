const { GraphQLString, GraphQLBoolean, GraphQLNonNull } = require('graphql');

const guard = require('../guards');
const authGuard = require('../guards/authorization');
const validationGuard = require('../guards/validation');
const resolvers = require('./resolvers/mobileAppUser');

const { MobileAppUserType, InputTimetableType } = require('../types/mobileApp');
const mobileAppUserValidationSchema = require('../../validationSchemas/mobileAppUser');

exports.createOrUpdate = {
    type: MobileAppUserType,

    args: {
        dev: { type: GraphQLBoolean },
        phoneModel: { type: new GraphQLNonNull(GraphQLString) },
        phoneID: { type: new GraphQLNonNull(GraphQLString) },
        appVersion: { type: GraphQLString },
        osVersion: { type: GraphQLString },
        mostPopularTimetable: { type: InputTimetableType }
    },

    resolve: guard(
        [authGuard, validationGuard(mobileAppUserValidationSchema)],
        resolvers.createOrUpdate
    )
};