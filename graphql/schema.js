const { GraphQLSchema } = require('graphql');

const RootQuery = require('./queries');
const RootMutation = require('./mutations');

// TODO: catch errors
// TODO: nest mutations
// TODO: use enmus where it's possible
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});