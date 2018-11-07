const { GraphQLString, GraphQLBoolean, GraphQLNonNull } = require('graphql');

const guard = require('../guards');
const authGuard = require('../guards/authGuard');
const validationGuard = require('../guards/validationGuard');

const { MobileAppUserType, InputTimetableType } = require('../types/mobileApp');
const MobileAppUser = require('../../models/mobileApp/MobileAppUser');
const mobileAppUserValidationSchema = require('../../validationSchemas/mobileAppUser');

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

    resolve: guard(
        [authGuard, validationGuard(mobileAppUserValidationSchema)],
        (parentValue, args) => MobileAppUser.createOrUpdate(args)
    )
};

module.exports = {
    createOrUpdate
};