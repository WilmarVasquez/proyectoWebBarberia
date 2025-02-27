const express = require("express");
const router = express.Router();
const barberoController = require("../controller/barbero.controller");

// 1. Crear un nuevo barbero
router.post("/", barberoController.crearBarbero);

// 2. Inicio de sesión de barbero
router.post("/login", barberoController.loginBarbero);

// 3. Buscar un barbero por correo (¡Esta ruta debe estar antes de /:id!)
router.get("/buscar", barberoController.obtenerBarberoPorCorreo);

// 4. Obtener todos los barberos
router.get("/", barberoController.obtenerBarberos); // Nueva ruta

// 5. Obtener un barbero por ID
router.get("/:id", barberoController.obtenerBarberoPorId);

// 6. Actualizar un barbero
router.put("/:id", barberoController.actualizarBarbero);

// 7. Cambiar el rol de un barbero (solo superusuario)
router.patch("/:id/rol", barberoController.cambiarRolBarbero);

module.exports = router;
