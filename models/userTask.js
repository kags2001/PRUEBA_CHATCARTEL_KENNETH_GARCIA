const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config');
const User = require('./User');
const Task = require('./Task');


class UserTask extends Model {}

UserTask.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id',
            },
            primaryKey: true,
        },
        task_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Task,
                key: 'id',
            },
            primaryKey: true,
        },
    },
    {
        sequelize,
        modelName: 'UserTask',
        tableName: 'user_tasks',
        timestamps: false,
    }
);

module.exports = UserTask;