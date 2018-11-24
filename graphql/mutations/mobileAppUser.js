const { GraphQLString, GraphQLBoolean, GraphQLNonNull } = require('graphql');

const guard = require('../guards');
const authGuard = require('../guards/authorization');
const validationGuard = require('../guards/validation');
const catchUnknownError = require('../errorsCatchers/catchUnknownError');

const { MobileAppUserType, InputTimetableType } = require('../types/mobileApp');
const MobileAppUser = require('../../models/mobileApp/MobileAppUser');
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
        catchUnknownError((parentValue, args) => MobileAppUser.createOrUpdate(args))
    )
};