/**
 * Middleware central de errores: captura cualquier error no manejado,
 * lo registra en consola y devuelve una respuesta 500 consistente.
 */
function manejarErrores(err, req, res, next) {
  console.error(`[ERROR] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.error(err.stack || err.message);

  res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor"
  });
}

module.exports = manejarErrores;
