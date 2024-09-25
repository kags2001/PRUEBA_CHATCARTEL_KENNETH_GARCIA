const express = require('express');
const cors = require('cors');
const { sequelize } = require('../config');
const {dbConnection} = require("../mondodb/mongoDbConfig");



class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '/api/users'
        this.authPath = '/api/auth'
        this.projectPath = '/api/project'
        this.taskPath = '/api/task'

        //Conectar db mongo
        this.conectarDb();

        //Middlewares
        this.middlewares();

        //Rutas app
        this.routes();
    }
    async conectarDb(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(express.static('public'));

        //CORS
        this.app.use(cors());

        //Lectura de body
        this.app.use(express.json());

        }

    routes(){
        this.app.use(this.usersPath, require('../routes/user'));
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.projectPath, require('../routes/project'));
        this.app.use(this.taskPath, require('../routes/task'));

    }

    async listen(){
        try {
            require('../models');
            await sequelize.sync();
            console.log('Base de datos (MYSQL) sincronizada correctamente');

            this.app.listen(this.port, () => {
                console.log('Servidor corriendo en el puerto', this.port);
            });
        } catch (error) {
            console.error('Error al sincronizar la base de datos:', error);
        }
    }
}

module.exports = Server;