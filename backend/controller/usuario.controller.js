const mongoose = require("mongoose");
const Usuario = require("../models/usuario.model");
const Barbero = require("../models/barbero.model");

// 1. Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, celular, clave } = req.body;

    if (!nombre || !correo || !celular || !clave) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const nuevoUsuario = new Usuario({ nombre, correo, celular, clave });
    const usuarioGuardado = await nuevoUsuario.save();

    res.status(201).json(usuarioGuardado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar el usuario", error });
  }
};

// 2. Inicio de sesión de usuario
exports.loginUsuario = async (req, res) => {
  try {
    const { correo, clave } = req.body;

    if (!correo || !clave) {
      return res.status(400).json({ message: "Faltan correo y/o contraseña" });
    }

    const usuarioEncontrado = await Usuario.findOne({ correo });
    if (!usuarioEncontrado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (usuarioEncontrado.clave !== clave) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

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
    res.status(500).json({ message: "Error al procesar el login", error });
  }
};

// 3. Obtener un usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el usuario", error });
  }
};

// 4. Obtener un usuario por correo
exports.obtenerUsuarioPorCorreo = async (req, res) => {
  try {
    let { correo } = req.query;

    if (!correo) {
      return res.status(400).json({ message: "El correo es requerido" });
    }

    correo = correo.trim().toLowerCase(); // Eliminar espacios y convertir a minúsculas

    console.log("Buscando usuario con correo:", correo); // Debugging

    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario por correo:", error);
    res.status(500).json({
      message: "Error interno al obtener el usuario por correo",
      error,
    });
  }
};

// 5. Actualizar un usuario
exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, celular } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }

    if (!nombre || !correo || !celular) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const usuarioEditado = await Usuario.findByIdAndUpdate(
      id,
      { nombre, correo, celular },
      { new: true }
    );

    if (!usuarioEditado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuarioEditado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al editar el usuario", error });
  }
};

// 6. Cambiar el rol de un usuario (superusuario)
exports.cambiarRolUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }

    const rolesPermitidos = [
      "cliente",
      "barbero",
      "administrador",
      "superadmin",
    ];
    if (!rolesPermitidos.includes(rol)) {
      return res.status(400).json({ message: "Rol no permitido" });
    }

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Si el nuevo rol es "barbero", mover el usuario a la colección de barberos
    if (rol === "barbero") {
      console.log("Moviendo usuario a barberos:", usuario); // Depuración
      const nuevoBarbero = new Barbero({
        nombre: usuario.nombre,
        correo: usuario.correo,
        celular: usuario.celular,
        clave: usuario.clave,
        rol: "barbero",
        fecha_creacion: usuario.fecha_creacion,
      });

      await nuevoBarbero.save(); // Guardar en la colección de barberos
      await Usuario.findByIdAndDelete(id); // Eliminar de la colección de usuarios

      return res.status(200).json({
        message: `Usuario movido a barberos con rol "${rol}"`,
        barbero: nuevoBarbero,
      });
    }

    // Si el rol no es "barbero", solo actualizar el rol
    usuario.rol = rol;
    await usuario.save();

    res.status(200).json({
      message: `Rol actualizado a "${rol}"`,
      usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el rol", error });
  }
};
