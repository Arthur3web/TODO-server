const { Task } = require("../models/models");
const ApiError = require("../error/ApiError");

class TaskController {
  async create(req, res, next) {
    const { title, timeEnd, isCompleted } = req.body;
    const { id } = req.user;
    const userId = id;
    if (!title || !timeEnd) {
      return next(ApiError.internal('Отсутсвует содержимое задачи или время выполнения'))
  }
    const task = await Task.create(
      { title, timeEnd, userId, isCompleted },
      { where: { id } }
    );
    return res.json(task);
  }

  async put(req, res, next) {
    const { id } = req.params;
    const task = await Task.findOne({ where: { id } });
    if (!task) {
      return next(ApiError.internal("Задача не существует"));
    } else if (task.userId !== req.user.id) {
      return next(ApiError.internal("Редактирование запрещено!"));
    }
    const newTask = req.body;
    const taskNew = await Task.update(newTask, { where: { id } });
    return res.json(taskNew);
  }

  async delete(req, res, next) {
    const { id } = req.params;
    const task = await Task.findOne({ where: { id } });
    if (!task) {
      return next(ApiError.internal("Задача не существует"));
    } else if (task.userId !== req.user.id) {
      return next(ApiError.internal("Удаление запрещено!"));
    }
    const taskNew = await Task.destroy({ where: { id } });
    return res.json(taskNew);
  }

  async getAll(req, res) {
    // const isToday = require('is-today');
    const dateNow = Date.now();
    const { id } = req.user;
    const { filterBy, selectedStatus } = req.query;
    const { where, order } = {
      where:
        filterBy === "Today"
          ? selectedStatus === "Done"
            ? {
                userId: id,
                timeEnd: dateNow,
                isCompleted: true,
              }
            : selectedStatus === "Undone"
            ? {
                userId: id,
                timeEnd: dateNow,
                isCompleted: false,
              }
            : {
                userId: id,
                timeEnd: dateNow,
              }
          : filterBy === "All"
          ? selectedStatus === "Done"
            ? {
                userId: id,
                isCompleted: true,
              }
            : selectedStatus === "Undone"
            ? {
                userId: id,
                isCompleted: false,
              }
            : {
                userId: id,
              }
          : {
              userId: id,
              // timeEnd: dateNow,
            },
      order: [filterBy === "Date" ? ["timeEnd", "ASC"] : ["timeStart", "DESC"]],
    };
    const tasks = await Task.findAll({
      where,
      order,
    });

    return res.json({ tasks });
  }
}

module.exports = new TaskController();
