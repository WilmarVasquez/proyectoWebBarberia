const express = require("express");
const router = express.Router();
const usuarioController = require("../controller/usuario.controller");

// 1. Crear un nuevo usuario
router.post("/", usuarioController.crearUsuario);

// 2. Inicio de sesión de usuario
router.post("/login", usuarioController.loginUsuario);

// 3. Obtener un usuario por correo (Aseguramos que esta ruta esté antes de /:id)
router.get("/buscar", usuarioController.obtenerUsuarioPorCorreo);

// 4. Obtener un usuario por ID
router.get("/:id", usuarioController.obtenerUsuarioPorId);

// 5. Actualizar un usuario
router.put("/:id", usuarioController.actualizarUsuario);

// 6. Cambiar el rol de un usuario (superusuario)
router.patch("/:id/rol", usuarioController.cambiarRolUsuario);

module.exports = router;
