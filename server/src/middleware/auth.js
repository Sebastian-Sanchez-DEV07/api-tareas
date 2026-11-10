/**
 * Middleware de autenticación: protege las rutas verificando el JWT.
 * El token se envía en el header Authorization: Bearer <token>.
 */
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token no proporcionado. Inicia sesión para continuar." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado." });
  }
}

module.exports = autenticar;
