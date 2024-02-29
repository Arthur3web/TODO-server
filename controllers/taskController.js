const {Task} = require('../models/models')
const ApiError = require('../error/ApiError')

class TaskController {
    async create(req, res) {
        const {title, timeEnd} = req.body
        
        const task = await Task.create({title, timeEnd})
        return res.json(task)

    }

    async put(req, res) {
        const {id} = req.params 
        const task = await Task.findOne({where: {id}})
        // console.log(task)
        if (!task) {
            return next(ApiError.internal('Задача не существует'))    
        } 
        const {title, timeEnd} = req.body    
        const taskNew = await Task.update({title, timeEnd}, {where: {id}})
        return res.json(taskNew)
        
    }

    async delete(req, res) {
        const {id} = req.params
        const task = await Task.findOne({where: {id}})
        if (!task) {
            return next(ApiError.internal('Задача не существует'))    
        }   
        const taskNew = await Task.destroy({where: {id}})
        return res.json(taskNew)

    }

    async getAll(req, res) {
        // const {userId} = req.params
        // const {isCompleted, timeEnd} = req.query
        // if (isCompleted === true) {
        //     const tasks = await Task.findAll({where: {isCompleted, userId}})
        //     return res.json(tasks)
        // }
        // if (isCompleted === false) {
        //     const tasks = await Task.findAll({where: isCompleted})
        //     return res.json(tasks)
        // }
        const tasks = await Task.findAll()
        return res.json(tasks)
        
    }
}

module.exports = new TaskController()