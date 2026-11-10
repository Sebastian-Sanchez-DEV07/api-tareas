/**
 * Controlador: maneja las peticiones y respuestas de /register y /login.
 */
const usuariosService = require("./usuarios.service");

const envolver = (manejador) => async (req, res, next) => {
  try {
    await manejador(req, res, next);
  } catch (error) {
    console.error(`[DEBUG] ${req.method} ${req.originalUrl} -`, error.message);
    next(error);
  }
};

async function registrar(req, res) {
  const { nombre, email, contrasena } = req.body;
  const usuario = await usuariosService.registrar(nombre, email, contrasena);
  res.status(201).json({
    mensaje: "Usuario registrado correctamente",
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
  });
}

async function login(req, res) {
  const { email, contrasena } = req.body;
  const usuario = await usuariosService.verificarCredenciales(email, contrasena);
  if (!usuario) {
    res.status(401).json({ error: "Credenciales inválidas" });
    return;
  }
  const token = usuariosService.generarToken(usuario);
  res.json({
    mensaje: "Inicio de sesión exitoso",
    token
  });
}

module.exports = { registrar: envolver(registrar), login: envolver(login) };
