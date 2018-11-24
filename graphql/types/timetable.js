const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean } = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLObjectId = require('./objectId');

const guard = require('../guards');
const authGuard = require('../guards/authorization');
const resolvers = require('../queries/resolvers/timetable');

const LessonType = new GraphQLObjectType({
    name: 'Lesson',
    fields: () => ({
        _id: { type: GraphQLObjectId },
        subject: { type: GraphQLString },
        classroom: { type: GraphQLString },
        class: { type: GraphQLString },
        teacherSlug: { type: GraphQLString },
        teacherName: { type: GraphQLString }
    })
});

const TeacherType = new GraphQLObjectType({
    name: 'Teacher',
    fields: () => ({
        _id: { type: GraphQLObjectId },
        slug: { type: GraphQLString },
        name: { type: GraphQLString },
        update: { type: GraphQLDateTime },
        timetable: { type: new GraphQLList(new GraphQLList(new GraphQLList(LessonType))) }
    })
});

const ClassroomType = new GraphQLObjectType({
    name: 'Classroom',
    fields: () => ({
        _id: { type: GraphQLObjectId },
        number: { type: GraphQLString },
        update: { type: GraphQLDateTime },
        timetable: { type: new GraphQLList(new GraphQLList(new GraphQLList(LessonType))) }
    })
});

const SchoolClassType = new GraphQLObjectType({
    name: 'SchoolClass',
    fields: () => ({
        _id: { type: GraphQLObjectId },
        slug: { type: GraphQLString },
        update: { type: GraphQLDateTime },
        timetable: { type: new GraphQLList(new GraphQLList(new GraphQLList(LessonType))) }
    })
});

const HourType = new GraphQLObjectType({
    name: 'Hour',
    fields: () => ({
        _id: { type: GraphQLObjectId },
        start: { type: GraphQLString },
        end: { type: GraphQLString }
    })
});

const TimetableUpdateRequestType = new GraphQLObjectType({
    name: 'TimetableUpdateRequestType',
    fields: () => ({
        _id: { type: GraphQLObjectId },
        requestorPhoneID: { type: GraphQLString },
        timetableUpdated: { type: GraphQLBoolean },
        dateTime: { type: GraphQLDateTime }
    })
});

const TimetableType = new GraphQLObjectType({
    name: 'Timetable',
    fields: {

        teachers: {
            type: new GraphQLList(TeacherType),
            resolve: resolvers.findTeachers
        },

        classrooms: {
            type: new GraphQLList(ClassroomType),
            resolve: resolvers.findClassrooms
        },

        classes: {
            type: new GraphQLList(SchoolClassType),
            resolve: resolvers.findSchoolClasses
        },

        hours: {
            type: new GraphQLList(HourType),
            resolve: resolvers.findHours
        },

        teacher: {
            type: TeacherType,
            args: {
                slug: { type: GraphQLString }
            },
            resolve: resolvers.findSingleTeacher
        },

        classroom: {
            type: ClassroomType,
            args: {
                number: { type: GraphQLString }
            },
            resolve: resolvers.findSingleClassroom
        },

        class: {
            type: SchoolClassType,
            args: {
                slug: { type: GraphQLString }
            },
            resolve: resolvers.findSingleSchoolClass
        },

        updateRequests: {
            type: new GraphQLList(TimetableUpdateRequestType),
            resolve: guard(authGuard, resolvers.findTimetableUpdateRequests)
        }
    }
});

module.exports = {
    TeacherType,
    ClassroomType,
    SchoolClassType,
    TimetableType,
    TimetableUpdateRequestType
};