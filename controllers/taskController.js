const {Task} = require('../models/models')
const ApiError = require('../error/ApiError')

class TaskController {
    async create(req, res) {
        const {title, timeEnd} = req.body
        
        const task = await Task.create({title, timeEnd})
        return res.json(task)

    }

    async getAll(req, res) {
        
    }
}

module.exports = new TaskController()