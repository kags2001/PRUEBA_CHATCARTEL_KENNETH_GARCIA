const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config');

class Role extends Model {}

Role.init(
    {
        role_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Role',
        tableName: 'roles',
        timestamps: false,
    }
);

module.exports = Role;