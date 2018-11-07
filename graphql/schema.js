const { GraphQLSchema } = require('graphql');

const RootQuery = require('./queries');
const RootMutation = require('./mutations');

// TODO: fix tests
// TODO: add GraphQL tests
// TODO: catch errors
// TODO: add timetable update mutations
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});