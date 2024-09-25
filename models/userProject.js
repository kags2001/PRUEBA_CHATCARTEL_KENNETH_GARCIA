const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config');
const User = require('./User');
const Project = require('./Project');

class UserProject extends Model {}

UserProject.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'user_id',
            },
        },
        project_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Project,
                key: 'project_id',
            },
        },
    },
    {
        sequelize,
        modelName: 'UserProject',
        tableName: 'user_projects',
        timestamps: false,
    }
);

module.exports = UserProject;