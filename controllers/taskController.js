const { Task } = require("../models/models");
const ApiError = require("../error/ApiError");
const { Op } = require("sequelize");
const moment = require("moment-timezone");

class TaskController {
  async create(req, res, next) {
    try {
      const { title, time_end } = req.body;
      const { id } = req.user;
      // const userId = id;
      if (!title || !time_end) {
        return next(
          ApiError.internal("Отсутсвует содержимое задачи или время выполнения")
        );
      }

      // // Создание момента с учетом временной зоны пользователя
      // const userTimezone = req.user.timezone;
      // const taskTime = moment.tz(timeEnd, userTimezone);
      // // Конвертация времени в UTC
      // const taskTimeUTC = taskTime.utc().format();

      const timeEndUTC = moment.utc(time_end); // Convert timeEnd to UTC
      const task = await Task.create({
        title,
        time_end: timeEndUTC,
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
    // Вручную устанавливаем значение updated_at
    newTask.updated_at = new Date();
    // Вызываем метод update
    const [updatedRowsCount, [updatedTask]] = await Task.update(newTask, {
      where: { id },
      returning: true, // Включаем возврат обновленной записи
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
    // // Конвертировать timeEnd обратно в часовой пояс пользователя
    // const userTimeZone = req.user.timezone; // Предположим, что пользователь имеет свой часовой пояс
    // const timeEndUserTZ = moment(task.timeEnd).tz(userTimeZone).format(); // Конвертировать в часовой пояс пользователя

    // task.timeEnd = timeEndUserTZ; // Обновить задачу с временем в часовом поясе пользователя

    const userTimezone = /*req.user.timezone ||*/ /*"Europe/Berlin" ||*/ "UTC";
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
                time_end: {
                  [Op.gte]: today,
                  [Op.lt]: endOfDay,
                },
                is_completed: true,
              }
            : selectedStatus === "Undone"
            ? {
                user_id: id,
                time_end: {
                  [Op.gte]: today,
                  [Op.lt]: endOfDay,
                },
                is_completed: false,
              }
            : {
                user_id: id,
                time_end: {
                  [Op.gte]: today,
                  [Op.lt]: endOfDay,
                },
              }
          : filterBy === "All"
          ? selectedStatus === "Done"
            ? {
                user_id: id,
                is_completed: true,
              }
            : selectedStatus === "Undone"
            ? {
                user_id: id,
                is_completed: false,
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
              is_completed: false,
            }
          : sortBy === "Date" && selectedStatus === "Done" && filterBy === "All"
          ? {
              user_id: id,
              is_completed: true,
            }
          : sortBy === "Date" && filterBy === "Today"
          ? {
              user_id: id,
              time_end: {
                [Op.gte]: today,
                [Op.lt]: endOfDay,
              },
            }
          : {
              user_id: id,
              time_end: {
                [Op.gte]: today,
                [Op.lt]: endOfDay,
              },
            },

      order: [sortBy === "Date" ? ["time_end", "ASC"] : ["time_start", "DESC"]],
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
