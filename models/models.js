const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define( 'user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "ADMIN"},
})

const Task = sequelize.define( 'Task', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, unique: true, allowNull: false},
    timeStart: {type: DataTypes.DATE, defaultValue: Date.now()},
    timeEnd: {type: DataTypes.DATE, allowNull: false}
})

User.hasMany(Task)
Task.belongsTo(User)

module.exports = {
    User, Task,
}