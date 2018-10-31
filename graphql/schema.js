const { GraphQLSchema } = require('graphql');

const RootQuery = require('./queries');
const RootMutation = require('./mutations');

// TODO: catch errors
// TODO: add mutations
module.exports = new GraphQLSchema({
    query: RootQuery,
    // mutation: RootMutation
});