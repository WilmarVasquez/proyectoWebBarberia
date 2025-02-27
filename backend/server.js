// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect("mongodb://localhost:27017/barberia")
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB: ", err));

// Rutas base
app.get("/", (req, res) => {
  res.send("API de Barbería funcionando");
});

// Importar y usar las rutas de usuario
const usuarioRoutes = require("./routes/usuario.routes");
app.use("/api/usuarios", usuarioRoutes); // linea api usuarios

// Importar y usar las rutas de citas
const citaRoutes = require("./routes/cita.routes"); // Importa la ruta de citas
app.use("/api/citas", citaRoutes); // Registra las rutas de citas correctamente

//Ruta de Barberos
const barberoRoutes = require("./routes/barbero.routes");
app.use("/api/barberos", barberoRoutes);

// Crear o verificar superusuario
(async () => {
  const Usuario = require("./models/usuario.model");
  const existeSuperAdmin = await Usuario.findOne({ rol: "superadmin" });
  if (!existeSuperAdmin) {
    await Usuario.create({
      nombre: "Super Admin",
      correo: "superadmin@admin.com",
      celular: "0000000000",
      clave: "superclave", // encriptar en proyecto real
      rol: "superadmin",
    });
    console.log("Superusuario creado con éxito");
  }
})();

// levantar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
