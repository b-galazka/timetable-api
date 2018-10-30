const { GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');

const guard = require('../guards');
const authGuard = require('../guards/authGuard');

const FakeType = new GraphQLObjectType({
    name: 'FakeType',
    fields: () => ({
        name: { type: GraphQLString },
        count: { type: GraphQLInt }
    })
});

module.exports = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        fakeRecord: {
            type: FakeType,
            resolve: guard(authGuard, () => {

                return {
                    name: 'fake record',
                    count: 10
                };
            })
        }
    }
});