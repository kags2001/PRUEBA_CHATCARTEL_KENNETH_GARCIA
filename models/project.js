const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config');

class Project extends Model {}

Project.init(
    {
        project_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        project_description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Project',
        tableName: 'projects',
        timestamps: false,
    }
);

module.exports = Project;