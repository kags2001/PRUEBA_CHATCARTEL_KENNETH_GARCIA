const {Router} = require('express');
const {userGet, userUpdate, userDelete, userCreate} = require("../controllers/userController");
const {check} = require("express-validator");
const {validateFields} = require("../middlewares/validate-fields");
const {validateRole, validateEmail} = require("../helpers/helpers");
const {validateJWT} = require("../middlewares/validate-jwt");
const {isSameOrAdminRole, isAdminRole} = require("../middlewares/validate-roles");


const router = Router();

router.get("/:id", [
    validateJWT,
    isSameOrAdminRole
], userGet);

router.put("/:id", [
    validateJWT,
    isSameOrAdminRole,
    check('role_name').custom(validateRole),
    validateFields
], userUpdate);

router.delete("/:id", [
    validateJWT,
    isAdminRole
], userDelete);

router.post("/", [
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom(validateEmail),
    check('username', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('role_name').not().isEmpty(),
    check('role_name').custom(validateRole),
    validateFields
], userCreate);

module.exports = router;