const {User} = require("../models");
const bcrypt = require('bcryptjs');
const {generateJWT} = require("../helpers/helpers");


const login = async (req, res) =>{
    const {email, password} = req.body;

    //Validar si existe el email
    const findUser = await User.findOne({ where: { email: email } });
    if(!findUser){
        return res.status(400).json({
            msg:"Usuario/password no son correctos"
        });
    }
    //Verificar password
    const validPassword = bcrypt.compareSync(password, findUser.password);
    if (!validPassword){
        return res.status(400).json({
            msg:"Usuario/password no son correctos"
        });
    }

    //Generar JWT
    const token = await generateJWT(findUser.id);

    try {
        res.json({
            findUser,
            token
        })
    } catch (error){
        console.log(error);
        return res.status(500).json({
            msg:"Error interno en el servidor"
        })
    }
}

module.exports = {
    login
}