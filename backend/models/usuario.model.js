// backend/models/usuario.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
  },
  celular: {
    type: String,
    required: true,
  },
  clave: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    enum: ["cliente", "barbero", "administrador", "superadmin"],
    default: "cliente",
  },
  fecha_creacion: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
