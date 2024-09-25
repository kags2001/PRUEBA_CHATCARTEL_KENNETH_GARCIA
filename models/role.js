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

//Roles predeterminados despues de sincronizar por primera vez la DB o si no se encuentran uno de estos
Role.afterSync(async () => {
    const roles = await Role.findAll();
    if (roles.length === 0) {
        await Role.bulkCreate([
            { role_name: 'USER' },
            { role_name: 'ADMIN' },
        ]);
        console.log('Roles predeterminados creados: USER, ADMIN');
    }
});

module.exports = Role;