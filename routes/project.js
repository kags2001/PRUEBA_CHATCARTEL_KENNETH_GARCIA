const {Router} = require('express');
const {
    projectCreate,
    projectFind,
    projectToUser,
    taskProjectCreate,
    projectTaskFind
} = require("../controllers/projectController");
const {validateJWT} = require("../middlewares/validate-jwt");
const {check} = require("express-validator");
const {validateFields} = require("../middlewares/validate-fields");


const router = Router();

router.get("/", [
    validateJWT,
], projectFind);


router.post("/", [
    validateJWT,
    check("project_name", 'El nombre del proyecto es requerido').not().isEmpty(),
    check("project_description", 'La descripcion del proyecto es requerido').not().isEmpty(),
    validateFields
], projectCreate);

router.post("/:projectId/tasks", [
    validateJWT,
    check("task_name", 'El nombre de la tarea es requerido').not().isEmpty(),
    check("task_description", 'La descripcion de la tarea es requerido').not().isEmpty(),
    validateFields
], taskProjectCreate);

router.get("/:projectId/tasks", [
    validateJWT,
], projectTaskFind);

router.post("/projectToUser", [
    validateJWT,
    check("user_id", 'El id del usuario es requerido').not().isEmpty(),
    check("project_id", 'El id del proyecto es requerido').not().isEmpty(),
    validateFields
], projectToUser);

module.exports = router;