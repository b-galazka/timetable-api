// backup of https://github.com/isayme/graphql-scalar-objectid

const { GraphQLScalarType } = require('graphql')
const ObjectId = require('bson').ObjectId


function isObjectId(str) {

    const objectidPattern = /^[0-9a-fA-F]{24}$/

    return objectidPattern.test(str)
}

const parseObjectId = _id => {
    if (isObjectId(_id)) {
        return ObjectId(_id)
    }

    throw new Error('ObjectId must be a single String of 24 hex characters')
}

const GraphQLObjectId = new GraphQLScalarType({
    name: 'ObjectId',
    description: 'The `ObjectId` scalar type represents a mongodb unique ID',
    serialize: String,
    parseValue: parseObjectId,
    parseLiteral: function parseLiteral(ast) {
        return parseObjectId(ast.value)
    }
})

module.exports = GraphQLObjectId