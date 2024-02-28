const {Task} = require('../models/models')
const ApiError = require('../error/ApiError')

class TaskController {
    async create(req, res) {
        const {title, timeStart, timeEnd} = req.body
        // const task = await TypeError.create({name})
        // return res.json(task)
        // let fileName

    }

    async getAll(req, res) {
        const tasks = await Task.findAll()
        return res.json(tasks)   
    }

    // async delete(req, res) {
        
    // }
}

module.exports = new TaskController()