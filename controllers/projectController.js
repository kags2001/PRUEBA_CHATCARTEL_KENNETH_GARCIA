const { Project, UserProject, User, Task} = require("../models");
const {findUserById, findProjectById, findUserProjectAssignment, filterProjets, findUserWithPendingTask} = require("../helpers/helpers");
const UserTask = require("../models/userTask");


const projectFind = async (req, res) => {
 try {
     const projects = await Project.findAll({
         include: [{
             model: User,
             where: { id: req.usuario.id },
             through: { attributes: [] }
         }],
         attributes: ['id', 'project_name', 'project_description'],
     });

     const Proyectos = await filterProjets(projects);

     res.json({
         Proyectos
     });
 }catch (error){
     console.log(error)
     res.status(500).json({
         msg:"Error interno en el servidor"
     })
 }
}

const projectCreate = async (req, res) => {
  try {
      const body = req.body;
      await Project.create(body);

      res.json({
          msg:"Proyecto creado satisfactoriamente"
      });

  } catch (error){
      console.log(error)
      res.status(500).json({
          msg:"Error interno en el servidor"
      })
  }
}

const projectTaskFind = async (req, res) => {
    try {
        const {projectId} = req.params;
       const tasks= await Task.findAll({
            where: {
                project_id: projectId,
            },
        });
        res.json({
            tasks
        });

    } catch (error){
        console.log(error)
        res.status(500).json({
            msg:"Error interno en el servidor"
        })
    }
}

const taskProjectCreate = async (req, res) => {
    try {
        const {projectId} = req.params;
        const {task_name, task_description, user_id} = req.body;
        const task = await Task.create({
            task_name,
            task_description,
            project_id: projectId,
            task_status_id: 2
        });

        if (user_id){
            const user =  await findUserById(user_id, res);
            if (!user) return;


            await UserTask.create({
                user_id: user_id,
                task_id: task.id
            });

            res.json({
                msg:`Tarea ${task.task_name} creada satisfactoriamente y asignada al usuario ${user.username}`
            });
        } else {
            const userPendingTask = await findUserWithPendingTask(projectId);
            if (userPendingTask){
                await UserTask.create({
                    user_id: userPendingTask.user_id,
                    task_id: task.id
                });

                res.json({
                    msg:`Tarea ${task.task_name} creada satisfactoriamente y asignada al usuario ${userPendingTask.user_id} por tener menos tareas pendientes`
                });
            }
        }
    } catch (error){
        console.log(error)
        res.status(500).json({
            msg:"Error interno en el servidor"
        })
    }
}


const projectToUser = async (req, res) =>{
    try {
        const {user_id, project_id} = req.body;
        const user = await findUserById(user_id, res);
        if (!user) return;

        const project = await findProjectById(project_id, res);
        if(!project) return;

        const existingAssignment = await findUserProjectAssignment(user_id, project_id);
        if (existingAssignment) {
            return res.status(400).json({
                msg: `El proyecto ${project.project_name} ya está asignado al usuario ${user.username}`
            });
        }

        await UserProject.create(req.body);
        res.json({
            msg:`Proyecto ${project.project_name} asignado al usuario ${user.username} satisfactoriamente`
        })
    }catch (error){
        console.log(error);
        res.json({
            msg:"Error interno en el servidor"
        })
    }
}

module.exports = {
    projectCreate,
    projectFind,
    projectToUser,
    taskProjectCreate,
    projectTaskFind
}