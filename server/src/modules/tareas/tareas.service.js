/**
 * Capa de servicio: acceso a datos de tareas con fs.promises.
 * Todas las operaciones son asincrónicas para no bloquear el Event Loop.
 */
const fs = require("node:fs/promises");
const { TAREAS_FILE } = require("../../config/config");

async function leerTareas() {
  try {
    const contenido = await fs.readFile(TAREAS_FILE, "utf-8");
    return JSON.parse(contenido);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function guardarTareas(tareas) {
  await fs.writeFile(TAREAS_FILE, JSON.stringify(tareas, null, 2), "utf-8");
}

async function obtenerTodas() {
  return leerTareas();
}

async function obtenerPorId(id) {
  const tareas = await leerTareas();
  return tareas.find((tarea) => tarea.id === id) || null;
}

async function crear(titulo, descripcion) {
  const tareas = await leerTareas();
  const nuevaTarea = {
    id: tareas.length > 0 ? Math.max(...tareas.map((t) => t.id)) + 1 : 1,
    titulo,
    descripcion,
    completada: false
  };
  tareas.push(nuevaTarea);
  await guardarTareas(tareas);
  return nuevaTarea;
}

async function actualizar(id, datos) {
  const tareas = await leerTareas();
  const tarea = tareas.find((item) => item.id === id);
  if (!tarea) return null;

  if (datos.titulo !== undefined) tarea.titulo = datos.titulo;
  if (datos.descripcion !== undefined) tarea.descripcion = datos.descripcion;
  if (datos.completada !== undefined) tarea.completada = datos.completada;

  await guardarTareas(tareas);
  return tarea;
}

async function eliminar(id) {
  const tareas = await leerTareas();
  const tarea = tareas.find((item) => item.id === id);
  if (!tarea) return null;

  const restantes = tareas.filter((item) => item.id !== id);
  await guardarTareas(restantes);
  return tarea;
}

module.exports = { obtenerTodas, obtenerPorId, crear, actualizar, eliminar };
