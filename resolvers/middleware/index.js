const { skip } = require('graphql-resolvers')
const Task = require('../../database/models/task')
const { isValidId } = require('../../database/util')

module.exports.isAuth = (_, __, { email }) => {
    if (!email) {
        throw new Error('Access denied please login')
    }
    return skip;
}

module.exports.isTaskOwner = async (_, { id }, { loggedInUserId }) => {
    try {
        if (!isValidId(id)) {
            throw new Error ('Invalid Id')
        } 
        const task = await Task.findById(id)
        if (!task) {
            throw new Error('Task not Found')
        } else if (task.user.toString() !== loggedInUserId) {
            throw new Error('You are not the task owner')
        }
        return skip
    } catch (error) {
        console.log(error)
        throw error
    }
}