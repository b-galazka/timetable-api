const { GraphQLObjectType, GraphQLList } = require('graphql');

const guard = require('../guards');
const authGuard = require('../guards/authGuard');

const { TeacherType, ClassroomType, SchoolClassType } = require('../types/timetable')

const Teacher = require('../../models/timetable/Teacher');
const Classroom = require('../../models/timetable/Classroom');
const SchoolClass = require('../../models/timetable/Class');

module.exports = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {

        teachers: {
            type: new GraphQLList(TeacherType),
            resolve: () => Teacher.loadList()
        },

        classrooms: {
            type: new GraphQLList(ClassroomType),
            resolve: () => Classroom.loadList()
        },

        schoolClass: {
            type: new GraphQLList(SchoolClassType),
            resolve: () => SchoolClass.loadList()
        }
    }
});