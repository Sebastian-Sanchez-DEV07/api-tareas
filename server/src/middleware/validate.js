/**
 * Middleware de validación: verifica los datos de entrada según la ruta.
 */
const validarRegistro = (req, res, next) => {
  const { nombre, email, contrasena } = req.body;

  if (!nombre || !email || !contrasena) {
    res.status(400).json({ error: "nombre, email y contrasena son obligatorios." });
    return;
  }
  next();
};

const validarLogin = (req, res, next) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    res.status(400).json({ error: "email y contrasena son obligatorios." });
    return;
  }
  next();
};

const validarTarea = (req, res, next) => {
  const { titulo, descripcion } = req.body;

  if (!titulo || !descripcion) {
    res.status(400).json({ error: "titulo y descripcion son obligatorios." });
    return;
  }
  next();
};

const validarId = (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "El id debe ser un número entero positivo." });
    return;
  }
  req.id = id;
  next();
};

module.exports = { validarRegistro, validarLogin, validarTarea, validarId };
