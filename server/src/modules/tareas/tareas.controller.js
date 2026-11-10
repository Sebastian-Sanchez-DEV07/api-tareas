/**
 * Controlador: maneja las peticiones y respuestas de /tareas.
 */
const tareasService = require("./tareas.service");

const envolver = (manejador) => async (req, res, next) => {
  try {
    await manejador(req, res, next);
  } catch (error) {
    console.error(`[DEBUG] ${req.method} ${req.originalUrl} -`, error.message);
    next(error);
  }
};

async function obtenerTodas(req, res) {
  const tareas = await tareasService.obtenerTodas();
  res.json(tareas);
}

async function crear(req, res) {
  const { titulo, descripcion } = req.body;
  const nuevaTarea = await tareasService.crear(titulo, descripcion);
  res.status(201).json(nuevaTarea);
}

async function actualizar(req, res) {
  const tarea = await tareasService.actualizar(req.id, req.body);
  if (!tarea) {
    res.status(404).json({ error: `No existe la tarea con id ${req.id}` });
    return;
  }
  res.json(tarea);
}

async function eliminar(req, res) {
  const tarea = await tareasService.eliminar(req.id);
  if (!tarea) {
    res.status(404).json({ error: `No existe la tarea con id ${req.id}` });
    return;
  }
  res.json({ mensaje: `Tarea ${req.id} eliminada`, tarea });
}

module.exports = { obtenerTodas: envolver(obtenerTodas), crear: envolver(crear), actualizar: envolver(actualizar), eliminar: envolver(eliminar) };
