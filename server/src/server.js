/**
 * Punto de entrada: levanta el servidor HTTP en el puerto configurado.
 */
const app = require("./app");
const { PORT } = require("./config/config");

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
