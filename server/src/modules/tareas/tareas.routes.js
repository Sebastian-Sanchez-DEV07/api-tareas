/**
 * Rutas de tareas: define los endpoints CRUD de /tareas.
 */
const express = require("express");
const tareasController = require("./tareas.controller");
const { validarTarea, validarId } = require("../../middleware/validate");

const router = express.Router();

router.get("/", tareasController.obtenerTodas);
router.post("/", validarTarea, tareasController.crear);
router.put("/:id", validarId, tareasController.actualizar);
router.delete("/:id", validarId, tareasController.eliminar);

module.exports = router;
