const Genero = require('../models/Genero');

// Obtener todos los géneros
const obtenerGeneros = async (req, res) => {
  try {
    const { estado } = req.query;
    let filtro = {};
    
    if (estado) {
      filtro.estado = estado;
    }
    
    const generos = await Genero.find(filtro).sort({ fechaCreacion: -1 });
    res.json({
      success: true,
      data: generos,
      count: generos.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener los géneros',
      error: error.message
    });
  }
};

// Obtener un género por ID
const obtenerGenero = async (req, res) => {
  try {
    const genero = await Genero.findById(req.params.id);
    
    if (!genero) {
      return res.status(404).json({
        success: false,
        mensaje: 'Género no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: genero
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener el género',
      error: error.message
    });
  }
};

// Crear un nuevo género
const crearGenero = async (req, res) => {
  try {
    const { nombre, descripcion, estado } = req.body;
    
    // Validar que el nombre no exista
    const generoExistente = await Genero.findOne({ nombre });
    if (generoExistente) {
      return res.status(400).json({
        success: false,
        mensaje: 'Ya existe un género con ese nombre'
      });
    }
    
    const genero = new Genero({
      nombre,
      descripcion,
      estado: estado || 'Activo'
    });

    const nuevoGenero = await genero.save();
    
    res.status(201).json({
      success: true,
      mensaje: 'Género creado exitosamente',
      data: nuevoGenero
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      mensaje: 'Error al crear el género',
      error: error.message
    });
  }
};

// Actualizar un género
const actualizarGenero = async (req, res) => {
  try {
    const { nombre, descripcion, estado } = req.body;
    
    const genero = await Genero.findById(req.params.id);
    if (!genero) {
      return res.status(404).json({
        success: false,
        mensaje: 'Género no encontrado'
      });
    }

    // Validar que el nuevo nombre no exista (si se está cambiando)
    if (nombre && nombre !== genero.nombre) {
      const generoExistente = await Genero.findOne({ nombre });
      if (generoExistente) {
        return res.status(400).json({
          success: false,
          mensaje: 'Ya existe un género con ese nombre'
        });
      }
      genero.nombre = nombre;
    }
    
    if (descripcion !== undefined) genero.descripcion = descripcion;
    if (estado !== undefined) genero.estado = estado;

    const generoActualizado = await genero.save();
    
    res.json({
      success: true,
      mensaje: 'Género actualizado exitosamente',
      data: generoActualizado
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      mensaje: 'Error al actualizar el género',
      error: error.message
    });
  }
};

// Eliminar un género
const eliminarGenero = async (req, res) => {
  try {
    const genero = await Genero.findById(req.params.id);
    
    if (!genero) {
      return res.status(404).json({
        success: false,
        mensaje: 'Género no encontrado'
      });
    }

    await Genero.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      mensaje: 'Género eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar el género',
      error: error.message
    });
  }
};

module.exports = {
  obtenerGeneros,
  obtenerGenero,
  crearGenero,
  actualizarGenero,
  eliminarGenero
};