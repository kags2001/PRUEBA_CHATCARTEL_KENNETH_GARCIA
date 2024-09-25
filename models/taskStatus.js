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

//Estados de tareas predeterminados despues de sincronizar por primera vez la DB o si no se encuentra uno de estos
TaskStatus.afterSync(async () => {
    const statuses = await TaskStatus.findAll();
    if (statuses.length === 0) {
        await TaskStatus.bulkCreate([
            { status_name: 'completada' },
            { status_name: 'pendiente' },
            { status_name: 'en progreso' },
        ]);
        console.log('Estados predeterminados creados: completada, pendiente, en progreso');
    }
});

module.exports = TaskStatus;