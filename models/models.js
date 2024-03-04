const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define( 'user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
})

const Task = sequelize.define( 'task', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    timeStart: {type: DataTypes.DATE, defaultValue: Date.now(new Date)},
    timeEnd: {type: DataTypes.DATE, allowNull: false},
    isCompleted: {type: DataTypes.BOOLEAN, defaultValue: false}
})

User.hasMany(Task)
Task.belongsTo(User)

module.exports = {
    User, Task,
}