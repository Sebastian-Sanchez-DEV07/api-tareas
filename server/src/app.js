/**
 * Aplicación Express: parseo del body, rutas y middleware.
 * Separada del servidor para poder testearla sin abrir un puerto.
 */
const express = require("express");
const bodyParser = require("body-parser");
const path = require("node:path");

const app = express();

const tareasRoutes = require("./modules/tareas/tareas.routes");
const usuariosRoutes = require("./modules/usuarios/usuarios.routes");
const autenticar = require("./middleware/auth");
const noEncontrado = require("./middleware/notFound");
const manejarErrores = require("./middleware/errors");

app.use(bodyParser.json());

app.use(usuariosRoutes);
app.use("/tareas", autenticar, tareasRoutes);

app.use(express.static(path.join(__dirname, "..", "..", "client")));

app.use(noEncontrado);
app.use(manejarErrores);

module.exports = app;
