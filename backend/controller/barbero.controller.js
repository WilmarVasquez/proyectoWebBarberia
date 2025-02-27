const mongoose = require("mongoose");
const Barbero = require("../models/barbero.model");
const Usuario = require("../models/usuario.model"); // Importación necesaria

// 1. Crear un nuevo barbero
exports.crearBarbero = async (req, res) => {
  try {
    const { nombre, correo, celular, clave } = req.body;

    // Validaciones básicas
    if (!nombre || !correo || !celular || !clave) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    // Crear y guardar
    const nuevoBarbero = new Barbero({
      nombre,
      correo,
      celular,
      clave,
    });
    const barberoGuardado = await nuevoBarbero.save();

    res.status(201).json(barberoGuardado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar el barbero" });
  }
};

// 2. Inicio de sesión de barbero
exports.loginBarbero = async (req, res) => {
  try {
    const { correo, clave } = req.body;

    // Validaciones
    if (!correo || !clave) {
      return res.status(400).json({ message: "Faltan correo y/o contraseña" });
    }

    // Buscar barbero por correo
    const barberoEncontrado = await Barbero.findOne({ correo });
    if (!barberoEncontrado) {
      return res.status(404).json({ message: "Barbero no encontrado" });
    }

    // Verificar contraseña
    if (barberoEncontrado.clave !== clave) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Si la contraseña coincide
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      barbero: {
        _id: barberoEncontrado._id,
        nombre: barberoEncontrado.nombre,
        correo: barberoEncontrado.correo,
        rol: barberoEncontrado.rol,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al procesar el login" });
  }
};

// 3. Obtener un barbero por ID
exports.obtenerBarberoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }

    const barbero = await Barbero.findById(id);
    if (!barbero) {
      return res.status(404).json({ message: "Barbero no encontrado" });
    }

    res.json(barbero);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el barbero" });
  }
};

// 4. Buscar un barbero por correo
exports.obtenerBarberoPorCorreo = async (req, res) => {
  try {
    const { correo } = req.query;

    // Validar que el correo esté presente
    if (!correo) {
      return res.status(400).json({ message: "El correo es requerido" });
    }

    // Buscar el barbero por correo
    const barbero = await Barbero.findOne({ correo });
    if (!barbero) {
      return res.status(404).json({ message: "Barbero no encontrado" });
    }

    res.json(barbero);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el barbero", error });
  }
};

// 5. Actualizar un barbero
exports.actualizarBarbero = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, celular } = req.body;

    // Validaciones básicas
    if (!nombre || !correo || !celular) {
      return res
        .status(400)
        .json({ message: "Faltan campos (nombre, correo, celular)" });
    }

    const barberoEditado = await Barbero.findByIdAndUpdate(
      id,
      { nombre, correo, celular },
      { new: true } // Retorna el documento actualizado
    );

    if (!barberoEditado) {
      return res.status(404).json({ message: "Barbero no encontrado" });
    }

    // Retornar el barbero editado
    res.json(barberoEditado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al editar el barbero" });
  }
};

// 6. Cambiar el rol de un barbero (superusuario)
exports.cambiarRolBarbero = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }

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

    // Buscar el barbero por ID
    const barbero = await Barbero.findById(id);
    if (!barbero) {
      return res.status(404).json({ message: "Barbero no encontrado" });
    }

    // Si el nuevo rol no es "barbero", mover el barbero a la colección de usuarios
    if (rol !== "barbero") {
      console.log("Moviendo barbero a usuarios:", barbero); // Depuración

      // Crear un nuevo usuario con los datos del barbero
      const nuevoUsuario = new Usuario({
        nombre: barbero.nombre,
        correo: barbero.correo,
        celular: barbero.celular,
        clave: barbero.clave,
        rol: rol,
        fecha_creacion: barbero.fecha_creacion,
      });

      await nuevoUsuario.save(); // Guardar en la colección de usuarios
      await Barbero.findByIdAndDelete(id); // Eliminar de la colección de barberos

      return res.status(200).json({
        message: `Barbero movido a usuarios con rol "${rol}"`,
        usuario: nuevoUsuario,
      });
    }

    // Si el rol sigue siendo "barbero", solo actualizar el rol
    barbero.rol = rol;
    await barbero.save();

    res.status(200).json({
      message: `Rol actualizado a "${rol}"`,
      barbero,
    });
  } catch (error) {
    console.error("Error en cambiarRolBarbero:", error); // Depuración
    res.status(500).json({ message: "Error al actualizar el rol", error });
  }
};

// 7. Obtener todos los barberos
exports.obtenerBarberos = async (req, res) => {
  try {
    const barberos = await Barbero.find(); // Obtener todos los barberos
    res.status(200).json(barberos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los barberos" });
  }
};
