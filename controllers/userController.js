const {User} = require('../models');
    const {passwordBcrypt, findUserById, logActivity} = require("../helpers/helpers");


    const userGet = async (req, res) => {
     try {
         const {id} = req.params;
         const user = await findUserById(id, res);
         if (!user) return;
         const usuarioAuth = req.usuario;

         await logActivity(usuarioAuth.id, "find", "user");
         res.json({
             user
         })
     }catch (error){
         res.status(500).json({
             msg:"Error interno del servidor"
         })
     }
    }

    const userDelete = async (req, res) => {
       try {
           const {id} = req.params;
           const user = await findUserById(id, res);
           if (!user) return;
           const usuarioAuth = req.usuario;

           await User.destroy({
               where: {
                   id: id,
               },
           });

           await logActivity(usuarioAuth.id, "delete", "user");
           res.json({
               msg:'Usuario eliminado correctamente'
           });
       }catch (error){
           console.log(error);
           res.status(500).json({
               msg:"Error interno en el servidor"
           });
           }
    }

    const userUpdate = async (req, res) => {
    try {
        const {id} = req.params;
        const {username, role_name} = req.body;
        const user = await findUserById(id, res);
        if (!user) return;
        const usuarioAuth = req.usuario;

        await User.update(
            { username:username, role_name: role_name  },
            {
                where: {
                    id: id,
                },
            },
        );
        await logActivity(usuarioAuth.id, "update", "user");
        res.json({
            msg:"Usuario actualizado satisfactoriamente",
        });
    }catch (error){
        console.log(error);
        res.status(500).json({
            msg:"Error interno en el servidor"
        });
    }
    }

    const userCreate = async (req, res) => {
        try {
            const {password,email, ...body} = req.body;
            const user = new User(body);

            //Encriptar password
            user.password = await passwordBcrypt(password);
            user.email = email;

            await user.save();
            await logActivity(user.id, "create", "user");
            res.json({
                msj:"Usuario creado satisfactoriamente"
            })
        }catch (error){
            console.log(error);
            res.status(500).json({
                msg:"Error interno en el servidor"
            });
            }
    };

    module.exports = {
        userGet,
        userCreate,
        userDelete,
        userUpdate
    }