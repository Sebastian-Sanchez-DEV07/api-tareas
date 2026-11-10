/**
 * Capa de servicio: acceso a datos de usuarios con fs.promises.
 */
const fs = require("node:fs/promises");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { USUARIOS_FILE, JWT_SECRET } = require("../../config/config");

async function leerUsuarios() {
  try {
    const contenido = await fs.readFile(USUARIOS_FILE, "utf-8");
    return JSON.parse(contenido);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function guardarUsuarios(usuarios) {
  await fs.writeFile(USUARIOS_FILE, JSON.stringify(usuarios, null, 2), "utf-8");
}

async function buscarPorEmail(email) {
  const usuarios = await leerUsuarios();
  return usuarios.find((usuario) => usuario.email === email) || null;
}

async function registrar(nombre, email, contrasena) {
  const usuarios = await leerUsuarios();
  const hash = await bcrypt.hash(contrasena, 10);
  const nuevoUsuario = { id: usuarios.length + 1, nombre, email, contrasena: hash };
  usuarios.push(nuevoUsuario);
  await guardarUsuarios(usuarios);
  return nuevoUsuario;
}

function generarToken(usuario) {
  const payload = { id: usuario.id, email: usuario.email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

async function verificarCredenciales(email, contrasena) {
  const usuario = await buscarPorEmail(email);
  if (!usuario) return null;
  const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
  return coincide ? usuario : null;
}

module.exports = { registrar, verificarCredenciales, generarToken, buscarPorEmail };
