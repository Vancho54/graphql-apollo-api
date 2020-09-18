const userResolver = require("./user")
const taskResolver = require("./task")
const { GraphQLDateTime } = require('graphql-iso-date')

const customScalarDateResolver = {
    Date: GraphQLDateTime
}

module.exports = [
    userResolver,
    taskResolver,
    customScalarDateResolver
]