const { Task } = require("../models/models");
const ApiError = require("../error/ApiError");
const { Op } = require("sequelize");
const moment = require("moment-timezone");

class TaskController {
  async create(req, res, next) {
    const { title, timeEnd, isCompleted } = req.body;
    const { id } = req.user;
    const userId = id;
    if (!title || !timeEnd) {
      return next(
        ApiError.internal("Отсутсвует содержимое задачи или время выполнения")
      );
    }

    // const timeEndUTC = moment.utc(timeEnd); // Convert timeEnd to UTC
    // const timeEndUTC = moment.utc(timeEnd).add(3, 'hours'); 

    // // Конвертировать timeEnd обратно в часовой пояс пользователя
    // const userTimeZone = req.user.timezone; // Предположим, что пользователь имеет свой часовой пояс
    // const timeEndUserTZ = moment(task.timeEnd).tz(userTimeZone).format(); // Конвертировать в часовой пояс пользователя

    // task.timeEnd = timeEndUserTZ; // Обновить задачу с временем в часовом поясе пользователя


    const task = await Task.create(
      { title, timeEnd, userId, isCompleted },
      { where: { id } }
    );
    console.log(timeEnd);
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
    // const today = new Date();
    // today.setHours(0, 0, 0, 0); // Устанавливаем время на начало сегодняшнего дня
    // const endOfDay = new Date(today);
    // endOfDay.setHours(23, 59, 59, 999); // Устанавливаем время на конец сегодняшнего дня
    // const tomorrow = new Date(today);
    // tomorrow.setDate(today.getDate() + 1); // Дата начала завтрашнего дня

    // const today = moment.tz("Europe/Moscow").startOf("day");
    // const endOfDay = moment.tz("Europe/Moscow").endOf("day");

    const userTimezone = req.user.timezone || "UTC";
    const today = moment.tz(moment(), userTimezone).startOf("day");
    const endOfDay = moment.tz(moment(), userTimezone).endOf("day");

    // const timezoneOffset = moment().tz(userTimezone).utcOffset();

    const { id } = req.user;
    const { filterBy, selectedStatus, sortBy } = req.query;
    const { where, order } = {
      where:
        filterBy === "Today"
          ? selectedStatus === "Done"
            ? {
                userId: id,
                timeEnd: {
                  [Op.gte]: today,
                  [Op.lt]: endOfDay,
                },
                isCompleted: true,
              }
            : selectedStatus === "Undone"
            ? {
                userId: id,
                timeEnd: {
                  [Op.gte]: today,
                  [Op.lt]: endOfDay,
                },
                isCompleted: false,
              }
            : {
                userId: id,
                timeEnd: {
                  [Op.gte]: today,
                  [Op.lt]: endOfDay,
                },
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
          : sortBy === "Date" && filterBy === "All"
          ? {
              userId: id,
            }
          : sortBy === "Date" &&
            selectedStatus === "Undone" &&
            filterBy === "All"
          ? {
              userId: id,
              isCompleted: false,
            }
          : sortBy === "Date" && selectedStatus === "Done" && filterBy === "All"
          ? {
              userId: id,
              isCompleted: true,
            }
          : sortBy === "Date" && filterBy === "Today"
          ? {
              userId: id,
              timeEnd: {
                [Op.gte]: today,
                [Op.lt]: endOfDay,
              },
            }
          : {
              userId: id,
              timeEnd: {
                [Op.gte]: today,
                [Op.lt]: endOfDay,
              },
            },

      order: [sortBy === "Date" ? ["timeEnd", "ASC"] : ["timeStart", "DESC"]],
    };

    const tasks = await Task.findAll({
      where,
      order,
    });
    console.log(tasks);
    return res.json({ tasks });
  }
}

module.exports = new TaskController();
