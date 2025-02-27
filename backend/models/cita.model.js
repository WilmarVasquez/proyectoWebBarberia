// backend/models/cita.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Definir el esquema para las citas
const CitaSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario", // Relacionamos con el modelo de Usuario
    required: true,
  },
  barberoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Barbero", // Relacionamos con el modelo de Barbero
    required: true,
  },
  fecha: {
    type: Date, // La fecha se almacena como Date para almacenar dia, mes y hora (ISO 8601)
    required: true,
  },
  fecha_creacion: {
    type: Date,
    default: Date.now, // Se guarda la fecha de creación automáticamente
  },
});

// Crear el modelo de Cita con el esquema
module.exports = mongoose.model("Cita", CitaSchema);
