/**
 * Rutas de usuarios: registro e inicio de sesión.
 */
const express = require("express");
const usuariosController = require("./usuarios.controller");
const { validarRegistro, validarLogin } = require("../../middleware/validate");

const router = express.Router();

router.post("/register", validarRegistro, usuariosController.registrar);
router.post("/login", validarLogin, usuariosController.login);

module.exports = router;
