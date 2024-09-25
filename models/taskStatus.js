const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config');

class TaskStatus extends Model {}

TaskStatus.init(
    {
        status_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'TaskStatus',
        tableName: 'task_status',
        timestamps: false,
    }
);

module.exports = TaskStatus;