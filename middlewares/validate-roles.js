const isAdminRole = (req, res, next) =>{
    if (!req.usuario){
        return res.status(500).json({
            msg:"Se quiere verificar el role sin validar el token primero"
        });
    }

    const {role_name, username} = req.usuario;

    if (role_name !== 'ADMIN'){
        return res.status(401).json({
            msg:`${username} No es administrador`
        });
    }

    next();
}

const isSameOrAdminRole = async (req, res, next) => {
    if (!req.usuario){
        return res.status(500).json({
            msg:"Se quiere verificar el role sin validar el token primero"
        });
    }

    const {id} = req.params;

    const {role_name, username} = req.usuario;

    if (req.usuario.id !== parseInt(id)) {
        if (role_name === 'ADMIN'){
            return next();
        }
        return res.status(401).json({
            msg: `${username} No tiene permisos para acceder a la información de otro usuario`
        });
    }
    next();
}

module.exports = {
    isAdminRole,
    isSameOrAdminRole
}