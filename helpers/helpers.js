const bcrypt = require('bcryptjs');
const {User, Project, UserProject} = require('../models');
const Role = require("../models/role");
const jwt = require('jsonwebtoken');
const {sequelize} = require("../config");



function passwordBcrypt (password){
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
}

async function validateEmail (email) {
        const isValidEmail = await User.findOne({ where: { email: email } });
        if (isValidEmail) {
            throw new Error(`EL correo ya esta registrado`);
        }
}

async function validateRole (role_name = '') {
    const roleExists = await Role.findOne({ where: { role_name: role_name } });
    if (!roleExists){
        throw new Error(`El role ${role_name} no existe`);
    }
}


const findUserById = async (id, res) => {
    try {
        const user = await User.findByPk(id);
        if (!user) {
            res.status(404).json({
                msg: "Usuario no existe"
            });
            return null;
        }
        return user;
    } catch (error) {
        res.status(500).json({
            msg: "Error interno del servidor",
            error: error.message,
        });
        return null;
    }
};

const findProjectById = async (id, res) => {
    try {
        const project = await Project.findByPk(id);

        if (!project) {
            res.status(404).json({
                msg: "Proyecto no existe"
            });
            return null;
        }

        return project;
    } catch (error) {
        res.status(500).json({
            msg: "Error interno del servidor",
            error: error.message,
        });
        return null;
    }
};

const findUserProjectAssignment = async (userId, projectId) => {
    try {
        const existingAssignment = await UserProject.findOne({
            where: {
                user_id: userId,
                project_id: projectId
            }
        });

        return existingAssignment;
    } catch (error) {
        console.error(error);
        return null;
    }
};

function generateJWT( id ){
    return new Promise((resolve, reject) => {
        const payload = { id };
        jwt.sign( payload,process.env.SECRETORPRIVATEKEY, {expiresIn: '4h'}, (err, token) => {
           if (err){
               console.log(err)
               reject('No se pudo generar el token');
           }
           else {
               resolve(token);
           }
        });
    });
}

const filterProjets = async (projects) => {
    try {
        const Proyectos = projects.map(project => {
            const projectData = project.get({ plain: true });
            return {
                id: projectData.id,
                project_name: projectData.project_name,
                project_description: projectData.project_description,
            };
        });

        return Proyectos;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const findUserWithPendingTask = async (projectId) => {
    const [result] = await sequelize.query(`
      SELECT 
        u.id AS user_id, 
        u.username, 
        COUNT(t.id) AS pending_tasks
      FROM 
        users u
      JOIN 
        user_projects up ON u.id = up.user_id
      JOIN 
        tasks t ON t.project_id = up.project_id
      JOIN 
        user_tasks ut ON t.id = ut.task_id AND ut.user_id = u.id
      WHERE 
        up.project_id = :projectId
        AND t.task_status_id = 2
      GROUP BY 
        u.id, u.username
      ORDER BY 
        pending_tasks ASC
      LIMIT 1;
    `, {
        replacements: { projectId },
        type: sequelize.QueryTypes.SELECT
    });
    return result;
};



module.exports = {
    validateEmail,
    passwordBcrypt,
    validateRole,
    findUserById,
    generateJWT,
    findProjectById,
    findUserProjectAssignment,
    filterProjets,
    findUserWithPendingTask
};