/**
 * Configuración central del servidor: puerto, secretos y rutas de archivos.
 */
const path = require("node:path");

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "secreto_dev_cambiar_en_produccion";

const DATA_DIR = path.join(__dirname, "..", "..", "data");
const TAREAS_FILE = path.join(DATA_DIR, "tareas.json");
const USUARIOS_FILE = path.join(DATA_DIR, "usuarios.json");

module.exports = { PORT, JWT_SECRET, TAREAS_FILE, USUARIOS_FILE };
