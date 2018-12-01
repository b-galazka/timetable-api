const { GraphQLSchema } = require('graphql');

const RootQuery = require('./queries');
const RootMutation = require('./mutations');

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});