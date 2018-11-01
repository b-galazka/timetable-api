const { GraphQLObjectType } = require('graphql');

const { createOrUpdate: createOrUpdateMobileApp } = require('./mobileApp');
const { createOrUpdate: createOrUpdateMobileAppUser } = require('./mobileAppUser');

module.exports = new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
        createOrUpdateMobileApp,
        createOrUpdateMobileAppUser
    }
});