// backend/routes/usuario.routes.js
const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario.model");

// 1. CREAR nuevo usuario (POST /api/usuarios)
router.post("/", async (req, res) => {
  try {
    const { nombre, correo, celular, clave } = req.body;

    // Validaciones básicas
    if (!nombre || !correo || !celular || !clave) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    // Crear y guardar
    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      celular,
      clave, // En un proyecto real: encriptar con bcrypt
    });
    const usuarioGuardado = await nuevoUsuario.save();

    res.status(201).json(usuarioGuardado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
});

// 2. LOGIN de usuario (POST /api/usuarios/login)
router.post("/login", async (req, res) => {
  try {
    const { correo, clave } = req.body;

    // Validaciones
    if (!correo || !clave) {
      return res.status(400).json({ message: "Faltan correo y/o contraseña" });
    }

    // Buscar usuario por correo
    const usuarioEncontrado = await Usuario.findOne({ correo });
    if (!usuarioEncontrado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar contraseña (en proyecto real usarías bcrypt.compare)
    if (usuarioEncontrado.clave !== clave) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Si la contraseña coincide
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      usuario: {
        _id: usuarioEncontrado._id,
        nombre: usuarioEncontrado.nombre,
        correo: usuarioEncontrado.correo,
        rol: usuarioEncontrado.rol,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al procesar el login" });
  }
});

// 3. OBTENER usuario por ID (GET /api/usuarios/:id)
router.get("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
});

// 4. ACTUALIZAR (editar) usuario (PUT /api/usuarios/:id)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, celular } = req.body;

    // Validaciones básicas
    if (!nombre || !correo || !celular) {
      return res
        .status(400)
        .json({ message: "Faltan campos (nombre, correo, celular)" });
    }

    const usuarioEditado = await Usuario.findByIdAndUpdate(
      id,
      { nombre, correo, celular },
      { new: true } // retorna el doc actualizado
    );

    if (!usuarioEditado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Retornar el usuario editado
    res.json(usuarioEditado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al editar el usuario" });
  }
});

// 5. CAMBIAR ROL (superusuario) (PATCH /api/usuarios/:id/rol)
router.patch("/:id/rol", async (req, res) => {
  try {
    const { rol } = req.body;
    const { id } = req.params;

    // Validar que sea un rol permitido
    const rolesPermitidos = [
      "cliente",
      "barbero",
      "administrador",
      "superadmin",
    ];
    if (!rolesPermitidos.includes(rol)) {
      return res.status(400).json({ message: "Rol no permitido" });
    }

    // Actualizar rol
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      { rol },
      { new: true }
    );
    if (!usuarioActualizado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuarioActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el rol" });
  }
});

// Crear una nueva cita
router.post("/citas", async (req, res) => {
  try {
    const { userId, fecha } = req.body;

    if (!userId || !fecha) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const nuevaCita = new Cita({
      userId,
      fecha,
    });

    const citaGuardada = await nuevaCita.save();

    res.status(201).json(citaGuardada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al agendar la cita" });
  }
});

module.exports = router;
