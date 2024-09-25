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
        const {id} = req.params;
        const user = await findUserById(id, res);
        if (!user) return;
        const usuarioAuth = req.usuario;

        if (usuarioAuth.id !== user.id){
            res.status(401).json({
                msg:'No es el mismo usuario'
            });
        } else {
            await User.destroy({
                where: {
                    id: id,
                },
            });

            await logActivity(usuarioAuth.id, "delete", "user");
            res.json({
                msg:'Usuario eliminado correctamente'
            });
        }
    }

    const userUpdate = async (req, res) => {
        const {id} = req.params;
        const {username, email, role_name} = req.body;
        const user = await findUserById(id, res);
        if (!user) return;
        const usuarioAuth = req.usuario;

       await User.update(
            { username:username, email: email, role_name: role_name  },
            {
                where: {
                    id: id,
                },
            },
        );
        await logActivity(usuarioAuth.id, "update", "user");
        res.json({
           msg:"Usuario actualizado satisfactoriamente",
       })
    }

    const userCreate = async (req, res) => {

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
    };

    module.exports = {
        userGet,
        userCreate,
        userDelete,
        userUpdate
    }