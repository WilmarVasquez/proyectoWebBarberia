const express = require("express");
const router = express.Router();
const citaController = require("../controller/cita.controller");

// 1. Crear una nueva cita
router.post("/", citaController.crearCita);

// 2. Obtener todas las citas de un usuario
router.get("/:userId", citaController.obtenerCitasPorUsuario);

// 3. Actualizar una cita
router.put("/:id", citaController.actualizarCita);

// 4. Eliminar una cita
router.delete("/:id", citaController.eliminarCita);

// 5. Obtener todas las citas de un barbero
router.get("/barbero/:barberoId", citaController.obtenerCitasPorBarbero);

module.exports = router;

module.exports = router;
