const {Router} = require('express');
const {validateJWT} = require("../middlewares/validate-jwt");
const {isAdminRole} = require("../middlewares/validate-roles");
const {taskDelete, taskUpdate} = require("../controllers/taskController");
const {check} = require("express-validator");
const {validateFields} = require("../middlewares/validate-fields");

const router = Router();


router.delete("/:id", [
    validateJWT,
    isAdminRole
], taskDelete);

router.put("/:id", [
    validateJWT,
    isAdminRole,
    check('task_status_id', 'El estado debe ser un número entero entre 1 y 3 según su estado').isInt({ min: 1, max: 3 }),
    validateFields
], taskUpdate);

module.exports = router;