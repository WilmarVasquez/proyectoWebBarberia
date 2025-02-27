const mongoose = require("mongoose");

const BarberoSchema = new mongoose.Schema({
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
    required: true,
    default: "barbero",
  },
  fecha_creacion: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Barbero", BarberoSchema);
