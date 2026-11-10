/**
 * Middleware 404: captura rutas inexistentes.
 */
function noEncontrado(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

module.exports = noEncontrado;
