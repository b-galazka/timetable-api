const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');

const Classroom = require('../../models/timetable/Classroom');
const SchoolClass = require('../../models/timetable/Class');
const Teacher = require('../../models/timetable/Teacher');

const LessonType = new GraphQLObjectType({
    name: 'Lesson',
    fields: () => ({
        subject: { type: GraphQLString },

        classroom: {
            type: ClassroomType,
            resolve: (parentValue) => {

                const classroomNumber = parentValue.classroom;

                if (classroomNumber === undefined) {

                    return;
                }

                return Classroom.findOne({ number: classroomNumber });
            }
        },

        schoolClass: {
            type: SchoolClassType,
            resolve: (parentValue) => {

                const schoolClassSlug = parentValue.class;

                if (schoolClassSlug === undefined) {

                    return;
                }

                return SchoolClass.findOne({ slug: schoolClassSlug });
            }
        },

        teacher: {
            type: TeacherType,
            resolve: (parentValue) => {

                const teacherSlug = parentValue.teacherSlug;

                if (teacherSlug === undefined) {

                    return;
                }

                return Teacher.findOne({ slug: teacherSlug });
            }
        }
    })
});

const TeacherType = new GraphQLObjectType({
    name: 'Teacher',
    fields: () => ({
        _id: { type: GraphQLString },
        slug: { type: GraphQLString },
        name: { type: GraphQLString },
        update: { type: GraphQLDateTime },
        timetable: { type: new GraphQLList(new GraphQLList(new GraphQLList(LessonType))) }
    })
});

const ClassroomType = new GraphQLObjectType({
    name: 'Classroom',
    fields: () => ({
        _id: { type: GraphQLString },
        number: { type: GraphQLString },
        update: { type: GraphQLDateTime },
        timetable: { type: new GraphQLList(new GraphQLList(new GraphQLList(LessonType))) }
    })
});

const SchoolClassType = new GraphQLObjectType({
    name: 'SchoolClass',
    fields: () => ({
        _id: { type: GraphQLString },
        slug: { type: GraphQLString },
        update: { type: GraphQLDateTime },
        timetable: { type: new GraphQLList(new GraphQLList(new GraphQLList(LessonType))) }
    })
});

module.exports = {
    TeacherType,
    ClassroomType,
    SchoolClassType
};