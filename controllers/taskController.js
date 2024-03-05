const { Task } = require("../models/models");
const ApiError = require("../error/ApiError");
const { Op } = require("sequelize");

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
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Устанавливаем время на начало сегодняшнего дня
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Дата начала завтрашнего дня

    const { id } = req.user;
    const { filterBy, selectedStatus } = req.query;
    const { where, order } = {
      where:
        filterBy === "Today"
          ? selectedStatus === "Done"
            ? {
                userId: id,
                timeEnd: {
                  [Op.gte]: today, // Фильтрация по дате больше или равно началу сегодняшнего дня
                  [Op.lt]: tomorrow, // Фильтрация по дате меньше завтрашнего дня
                },
                isCompleted: true,
              }
            : selectedStatus === "Undone"
            ? {
                userId: id,
                timeEnd: {
                  [Op.gte]: today,
                  [Op.lt]: tomorrow,
                },
                isCompleted: false,
              }
            : {
                userId: id,
                timeEnd: {
                  [Op.gte]: today,
                  [Op.lt]: tomorrow,
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
          : {
              userId: id,
              timeEnd: {
                [Op.gte]: today,
                [Op.lt]: tomorrow,
              },
            },
      order: [filterBy === "Date" ? ["timeEnd", "ASC"] : ["timeStart", "DESC"]],
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

// if (filterBy === "Date") {
//   if (filterBy === "Today" || filterBy === "All") {
//     if (selectedStatus === "All" || selectedStatus === "Done" || selectedStatus === "Undone") {
//       // Сортировка по полю timeEnd в порядке возрастания
//       order = [["timeEnd", "ASC"]];
//     } else {
//       // Сортировка по полю timeStart в порядке убывания
//       order = [["timeStart", "DESC"]];
//     }
//   } else {
//     // Сортировка по полю timeStart в порядке убывания
//     order = [["timeStart", "DESC"]];
//   }
// } else {
//   // Сортировка по полю timeStart в порядке убывания
//   order = [["timeStart", "DESC"]];
// }

// filterBy === "Date"
//   ? filterBy === "Today" || filterBy === "All"
//     ? selectedStatus === "All" ||
//       selectedStatus === "Done" ||
//       selectedStatus === "Undone"
//       ? {
//           // Сортировка по полю timeEnd в порядке возрастания
//           order: [["timeEnd", "ASC"]],
//         }
//       : {
//           // Сортировка по полю timeStart в порядке убывания
//           order: [["timeStart", "DESC"]],
//         }
//     : {
//         // Сортировка по полю timeStart в порядке убывания
//         order: [["timeStart", "DESC"]],
//       }
//   : {
//       // Сортировка по полю timeStart в порядке убывания
//       order: [["timeStart", "DESC"]],
//     };
