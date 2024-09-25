const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config');
const Project = require('./Project');
const path = require('path');
const TaskStatus = require(path.resolve(__dirname, 'TaskStatus'));
class Task extends Model {}

Task.init(
    {
        task_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        task_description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        project_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Project,
                key: 'id',
            },
        },
        task_status_id: {
            type: DataTypes.INTEGER,
            references: {
                model: TaskStatus,
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: 'Task',
        tableName: 'tasks',
        timestamps: false,
    }
);

module.exports = Task;