const { Task } = require("../models/models");
const ApiError = require("../error/ApiError");
const { Op } = require("sequelize");
const moment = require("moment-timezone");

class TaskController {
  async create(req, res, next) {
    try {
      const { title, timeend } = req.body;
      const { id } = req.user;
      // const userId = id;
      if (!title || !timeend) {
        return next(
          ApiError.internal("Отсутсвует содержимое задачи или время выполнения")
        );
      }

      // const timeEndUTC = moment.utc(timeend); // Convert timeEnd to UTC
      const userTimezone = req.user.timezone || "UTC";
      const timeEndUTC = moment.tz(timeend, userTimezone).utc().format(); 

      const task = await Task.create({
        title,
        timeend: timeEndUTC,
        user_id: id,
        updated_at: Date.now(),
      });

      return res.json(task);
    } catch (error) {
      return next(
        ApiError.internal(
          "Ошибка при создании задачи. Проверьте введенные данные"
        )
      );
    }
  }

  async put(req, res, next) {
    const { id } = req.params;
    const task = await Task.findOne({ where: { id } });
    if (!task) {
      return next(ApiError.internal("Задача не существует"));
    } else if (task.user_id !== req.user.id) {
      return next(ApiError.internal("Редактирование запрещено!"));
    }
    const newTask = req.body;
    newTask.updated_at = new Date();
    if ('title' in newTask && !newTask.title) {
      return next(ApiError.internal("Поле title не может быть пустым"));
    }
    const [updatedRowsCount, [updatedTask]] = await Task.update(newTask, {
      where: { id },
      returning: true, 
    });

    if (updatedRowsCount === 0) {
      return next(ApiError.internal("Не удалось обновить задачу"));
    } 
    return res.json(updatedTask);
  }

  async delete(req, res, next) {
    const { id } = req.params;
    const task = await Task.findOne({ where: { id } });
    if (!task) {
      return next(ApiError.internal("Задача не существует"));
    } else if (task.user_id !== req.user.id) {
      return next(ApiError.internal("Удаление запрещено!"));
    }
    const taskNew = await Task.destroy({ where: { id } });
    return res.json(taskNew);
  }

  async getAll(req, res) {
    const userTimezone = req.user.timezone || "UTC";
    const today = moment.tz(moment(), userTimezone).startOf("day");
    const endOfDay = moment.tz(moment(), userTimezone).endOf("day");

    const { id } = req.user;
    const { filterBy, selectedStatus, sortBy } = req.query;
    const { where, order } = {
      where:
        filterBy === "Today"
          ? selectedStatus === "Done"
            ? {
                user_id: id,
                timeend: {
                  [Op.gte]: today,
                  [Op.lt]: endOfDay,
                },
                iscompleted: true,
              }
            : selectedStatus === "Undone"
            ? {
                user_id: id,
                timeend: {
                  [Op.gte]: today,
                  [Op.lt]: endOfDay,
                },
                iscompleted: false,
              }
            : {
                user_id: id,
                timeend: {
                  [Op.gte]: today,
                  [Op.lt]: endOfDay,
                },
              }
          : filterBy === "All"
          ? selectedStatus === "Done"
            ? {
                user_id: id,
                iscompleted: true,
              }
            : selectedStatus === "Undone"
            ? {
                user_id: id,
                iscompleted: false,
              }
            : {
                user_id: id,
              }
          : sortBy === "Date" && filterBy === "All"
          ? {
              user_id: id,
            }
          : sortBy === "Date" &&
            selectedStatus === "Undone" &&
            filterBy === "All"
          ? {
              user_id: id,
              iscompleted: false,
            }
          : sortBy === "Date" && selectedStatus === "Done" && filterBy === "All"
          ? {
              user_id: id,
              iscompleted: true,
            }
          : sortBy === "Date" && filterBy === "Today"
          ? {
              user_id: id,
              timeend: {
                [Op.gte]: today,
                [Op.lt]: endOfDay,
              },
            }
          : {
              user_id: id,
              timeend: {
                [Op.gte]: today,
                [Op.lt]: endOfDay,
              },
            },

      order: [sortBy === "Date" ? ["timestart", "DESC"] : ["timeend", "ASC"]],
    };

    const tasks = await Task.findAll({
      where,
      order,
    });
    console.log(userTimezone);
    console.log(tasks);
    return res.json({ tasks });
  }
}

module.exports = new TaskController();
