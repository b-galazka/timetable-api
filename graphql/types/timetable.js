const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLObjectId = require('./objectId');

const Teacher = require('../../models/timetable/Teacher');
const Classroom = require('../../models/timetable/Classroom');
const SchoolClass = require('../../models/timetable/Class');
const Hour = require('../../models/timetable/Hour');
const catchUnknownError = require('../errorsCatchers/catchUnknownError');

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

const TimetableType = new GraphQLObjectType({
    name: 'Timetable',
    fields: {

        teachers: {
            type: new GraphQLList(TeacherType),
            resolve: catchUnknownError(() => Teacher.loadList())
        },

        classrooms: {
            type: new GraphQLList(ClassroomType),
            resolve: catchUnknownError(() => Classroom.loadList())
        },

        classes: {
            type: new GraphQLList(SchoolClassType),
            resolve: catchUnknownError(() => SchoolClass.loadList())
        },

        hours: {
            type: new GraphQLList(HourType),
            resolve: catchUnknownError(() => Hour.loadList())
        },

        teacher: {
            type: TeacherType,
            args: {
                slug: { type: GraphQLString }
            },
            resolve: catchUnknownError((parentValue, args) => {

                const { slug } = args;

                if (slug === undefined) {

                    return Teacher.loadFirstOne();
                }

                return Teacher.findOne({ slug });
            })
        },

        classroom: {
            type: ClassroomType,
            args: {
                number: { type: GraphQLString }
            },
            resolve: catchUnknownError((parentValue, args) => {

                const { number } = args;
                const criteria = (number === undefined) ? {} : { number };

                return Classroom.findOne(criteria, {}, { sort: { number: 1 } });
            })
        },

        class: {
            type: SchoolClassType,
            args: {
                slug: { type: GraphQLString }
            },
            resolve: catchUnknownError((parentValue, args) => {

                const { slug } = args;
                const criteria = (slug === undefined) ? {} : { slug };

                return SchoolClass.findOne(criteria, {}, { sort: { slug: 1 } });
            })
        }
    }
});

module.exports = {
    TeacherType,
    ClassroomType,
    SchoolClassType,
    TimetableType
};