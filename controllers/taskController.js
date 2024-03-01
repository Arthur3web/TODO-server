const { Task } = require("../models/models");
const ApiError = require("../error/ApiError");

class TaskController {
  async create(req, res) {
    const { title, timeEnd, userId, isCompleted } = req.body;

    const task = await Task.create({ title, timeEnd, userId, isCompleted });
    return res.json(task);
  }

  async put(req, res) {
    const { id } = req.params;
    const task = await Task.findOne({ where: { id } });
    // console.log(task)
    if (!task) {
      return next(ApiError.internal("Задача не существует"));
    }
    const { title, timeEnd } = req.body;
    const taskNew = await Task.update({ title, timeEnd }, { where: { id } });
    return res.json(taskNew);
  }

  async delete(req, res) {
    const { id } = req.params;
    const task = await Task.findOne({ where: { id } });
    if (!task) {
      return next(ApiError.internal("Задача не существует"));
    }
    const taskNew = await Task.destroy({ where: { id } });
    return res.json(taskNew);
  }

  async getAll(req, res) {
    const dateNow = Date.now();
    // const { userId } = req.params;
    const { userId, filterBy, selectedStatus } = req.query;
    const { where, order } = {
      where:
        filterBy === "Today"
          ? {
              userId,
              timeEnd: dateNow,
            }
          : selectedStatus === "Done"
          ? {
              userId,
              timeEnd: dateNow,
              isCompleted: true,
            }
          : selectedStatus === "Undone"
          ? {
              userId,
              timeEnd: dateNow,
              isCompleted: false,
            }
          : {
              userId,
            },
      order: [filterBy === "Date" ? ["timeEnd", "ASC"] : ["timeEnd", "DESC"]],
    };
    const tasks = await Task.findAll({
      where,
      order,
    });

    return res.json(tasks);
  }
}

module.exports = new TaskController();
