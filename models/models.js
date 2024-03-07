const { default: timestamp } = require("time-stamp");
const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  timezone: { type: DataTypes.STRING, allowNull: false },
});

const Task = sequelize.define(
  "task",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    timeStart: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW /*defaultValue: Date.now(new Date)*/,
    },
    timeEnd: { type: DataTypes.DATE, allowNull: false },
    isCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    timestamps: false, // Отключение временных меток, если не нужны
    // timezone: "Etc/UTC", // Указание временной зоны (может повлиять на сохранение времени в базе данных)
  }
);

User.hasMany(Task);
Task.belongsTo(User);

module.exports = {
  User,
  Task,
};
