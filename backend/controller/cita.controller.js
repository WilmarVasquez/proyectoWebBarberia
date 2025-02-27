const Cita = require("../models/cita.model");

// 1. Crear una nueva cita
exports.crearCita = async (req, res) => {
  try {
    const { userId, barberoId, fecha } = req.body;

    // Validar si los datos están presentes
    if (!userId || !barberoId || !fecha) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    // Convertir la fecha a un objeto Date
    const fechaCita = new Date(fecha);

    // Validar que la hora esté entre las 8 AM y las 9 PM
    const hora = fechaCita.getHours();
    if (hora < 8 || hora > 21) {
      return res
        .status(400)
        .json({ message: "La hora debe estar entre las 8 AM y las 9 PM" });
    }

    // Crear la cita
    const nuevaCita = new Cita({
      userId,
      barberoId,
      fecha: fechaCita,
    });

    // Guardar la cita en la base de datos
    const citaGuardada = await nuevaCita.save();

    // Responder con los datos de la cita guardada
    res.status(201).json(citaGuardada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al agendar la cita" });
  }
};

// 2. Obtener todas las citas de un usuario
exports.obtenerCitasPorUsuario = async (req, res) => {
  try {
    const { userId } = req.params;

    // Buscar citas asociadas al usuario
    const citas = await Cita.find({ userId }).populate("barberoId");
    if (!citas) {
      return res.status(404).json({ message: "No se encontraron citas" });
    }

    res.status(200).json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las citas" });
  }
};

// 3. Actualizar una cita
exports.actualizarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha } = req.body;

    // Validar si la fecha está presente
    if (!fecha) {
      return res
        .status(400)
        .json({ message: "La fecha es requerida para actualizar la cita" });
    }

    // Convertir la fecha a un objeto Date
    const fechaCita = new Date(fecha);

    // Validar que la hora esté entre las 8 AM y las 9 PM
    const hora = fechaCita.getHours();
    if (hora < 8 || hora > 21) {
      return res
        .status(400)
        .json({ message: "La hora debe estar entre las 8 AM y las 9 PM" });
    }

    // Buscar y actualizar la cita
    const citaActualizada = await Cita.findByIdAndUpdate(
      id,
      { fecha: fechaCita },
      { new: true }
    );

    if (!citaActualizada) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    res.status(200).json(citaActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la cita" });
  }
};

// 4. Eliminar una cita
exports.eliminarCita = async (req, res) => {
  try {
    const { id } = req.params;

    // Eliminar la cita por ID
    const citaEliminada = await Cita.findByIdAndDelete(id);

    if (!citaEliminada) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    res.status(200).json({ message: "Cita eliminada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la cita" });
  }
};

// 5. Obtener todas las citas de un barbero
exports.obtenerCitasPorBarbero = async (req, res) => {
  try {
    const { barberoId } = req.params;

    // Buscar citas asociadas al barbero
    const citas = await Cita.find({ barberoId })
      .populate("userId", "nombre") // Incluir el nombre del usuario
      .populate("barberoId", "nombre"); // Incluir el nombre del barbero
    if (!citas) {
      return res.status(404).json({ message: "No se encontraron citas" });
    }

    res.status(200).json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las citas" });
  }
};
