const jwt = require('jsonwebtoken');
const {User} = require('../models');

const validateJWT = async (req, res, next) => {
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg:"No hay token en la petición"
        });
    }

    try {
        const {id} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        req.id = id;
        const usuario = await User.findByPk(id);



        req.usuario = usuario;
        next();
    } catch (error){
        console.log(error);
        res.status(401).json({
            msg:"Token inválido"
        })
    }
}

module.exports = {validateJWT}