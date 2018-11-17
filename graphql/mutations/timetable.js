const { GraphQLString, GraphQLNonNull } = require('graphql');

const { TimetableType } = require('../types/timetable');
const ErrorResponse = require('../errors/ErrorResponse');

const logger = require('../../utils/logger');
const guard = require('../guards');
const authGuard = require('../guards/authGuard');
const validationGuard = require('../guards/validationGuard');
const timeProtectionGuard = require('../guards/timetableTimeProtectionGuard');

const catchUnknownError = require('../errorsCatchers/catchUnknownError');
const getScrappedTimetable = require('../../functions/getScrappedTimetable');

const TimetableUpdater = require('../../tools/TimetableUpdater');
const TimetablesComparator = require('../../tools/TimetablesComparator');
const UpdateRequest = require('../../models/mobileApp/UpdateRequest');
const updateRequestSchema = require('../../validationSchemas/timetableUpdateUserRequest');

exports.updateTimetable = {
    type: TimetableType,

    resolve: guard(
        authGuard,

        catchUnknownError(async () => {

            const scrappedTimetable = await getScrappedTimetable();
            const timetableUpdater = new TimetableUpdater(scrappedTimetable);

            await timetableUpdater.update();

            return {};
        })
    )
};

exports.requestTimetableUpdate = {
    type: TimetableType,

    args: {
        phoneID: { type: new GraphQLNonNull(GraphQLString) }
    },

    resolve: guard(
        [authGuard, timeProtectionGuard, validationGuard(updateRequestSchema)],

        catchUnknownError(async (parentValue, args) => {

            const { phoneID } = args;
            const scrappedTimetable = await getScrappedTimetable();
            const comparator = new TimetablesComparator(scrappedTimetable.teachers);
            const areChangesInTimetable = await comparator.areChangesInTimetable();

            UpdateRequest
                .create({
                    requestorPhoneID: phoneID,
                    timetableUpdated: areChangesInTimetable
                })
                .catch((err) => logger.error(err));

            if (!areChangesInTimetable) {

                throw new ErrorResponse('no changes in timetable detected', 403);
            }

            const timetableUpdater = new TimetableUpdater(scrappedTimetable);

            await timetableUpdater.update();

            return {};
        })
    )
};