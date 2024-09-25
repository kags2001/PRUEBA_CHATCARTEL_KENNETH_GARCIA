const {Task, User} = require('../models');
const {findTaskById, logActivity} = require('../helpers/helpers')
const UserTask = require("../models/userTask");

const taskDelete = async (req, res) => {
 try {
     const {id} = req.params;
     const usuarioAuth = req.usuario;

     const task = await findTaskById(id, res);
     if (!task) return;

     const userTask = await UserTask.findByPk(id);
     if (userTask) {
         res.status(400).json({
             msg: "El proyecto no se puede eliminar porque tiene usuario/s asignado a el"
         });
     } else {
         await Task.destroy({
             where: {
                 id: id,
             },
         });


         await logActivity(usuarioAuth.id, "delete", "task");
         res.json({
             msg: 'Tarea eliminada correctamente'
         });

     }
 }catch (error){
     console.log(error)
     res.status(500).json({
         msg:"Error interno en el servidor"
     })
 }
}

const taskUpdate = async (req, res) => {
   try {
       const {id} = req.params;
       const {task_name, task_description,task_status_id} = req.body;
       const usuarioAuth = req.usuario;

       const task = await findTaskById(id, res);
       if (!task) return;

       await Task.update(
           { task_name, task_description, task_status_id },
           {
               where: {
                   id: id,
               },
           },
       );
       await logActivity(usuarioAuth.id, "update", "task");
       res.json({
           msg: 'Tarea actualizada correctamente'
       });
   }catch (error){
       console.log(error)
       res.status(500).json({
           msg:"Error interno en el servidor"
       })
       }
}
module.exports = {
    taskDelete,
    taskUpdate
}