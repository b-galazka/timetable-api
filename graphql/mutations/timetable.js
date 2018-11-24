const { GraphQLString, GraphQLNonNull } = require('graphql');

const { TimetableType } = require('../types/timetable');

const guard = require('../guards');
const authGuard = require('../guards/authorization');
const validationGuard = require('../guards/validation');
const timeProtectionGuard = require('../guards/timetableTimeProtection');
const resolvers = require('./resolvers/timetable');

const updateRequestSchema = require('../../validationSchemas/timetableUpdateUserRequest');

exports.updateTimetable = {
    type: TimetableType,
    resolve: guard(authGuard, resolvers.updateTimetable)
};

exports.requestTimetableUpdate = {
    type: TimetableType,

    args: {
        phoneID: { type: new GraphQLNonNull(GraphQLString) }
    },

    resolve: guard(
        [authGuard, timeProtectionGuard, validationGuard(updateRequestSchema)],
        resolvers.requestTimetableUpdate
    )
};