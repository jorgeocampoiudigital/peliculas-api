const Tipo = require('../models/Tipo');

// Obtener todos los tipos
const obtenerTipos = async (req, res) => {
  try {
    const tipos = await Tipo.find().sort({ fechaCreacion: -1 });
    res.json({
      success: true,
      data: tipos,
      count: tipos.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener los tipos',
      error: error.message
    });
  }
};

// Obtener un tipo por ID
const obtenerTipo = async (req, res) => {
  try {
    const tipo = await Tipo.findById(req.params.id);
    
    if (!tipo) {
      return res.status(404).json({
        success: false,
        mensaje: 'Tipo no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: tipo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener el tipo',
      error: error.message
    });
  }
};

// Crear un nuevo tipo
const crearTipo = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    
    // Validar que el nombre no exista
    const tipoExistente = await Tipo.findOne({ nombre });
    if (tipoExistente) {
      return res.status(400).json({
        success: false,
        mensaje: 'Ya existe un tipo con ese nombre'
      });
    }
    
    const tipo = new Tipo({
      nombre,
      descripcion
    });

    const nuevoTipo = await tipo.save();
    
    res.status(201).json({
      success: true,
      mensaje: 'Tipo creado exitosamente',
      data: nuevoTipo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      mensaje: 'Error al crear el tipo',
      error: error.message
    });
  }
};

// Actualizar un tipo
const actualizarTipo = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    
    const tipo = await Tipo.findById(req.params.id);
    if (!tipo) {
      return res.status(404).json({
        success: false,
        mensaje: 'Tipo no encontrado'
      });
    }

    // Validar que el nuevo nombre no exista (si se está cambiando)
    if (nombre && nombre !== tipo.nombre) {
      const tipoExistente = await Tipo.findOne({ nombre });
      if (tipoExistente) {
        return res.status(400).json({
          success: false,
          mensaje: 'Ya existe un tipo con ese nombre'
        });
      }
      tipo.nombre = nombre;
    }
    
    if (descripcion !== undefined) tipo.descripcion = descripcion;

    const tipoActualizado = await tipo.save();
    
    res.json({
      success: true,
      mensaje: 'Tipo actualizado exitosamente',
      data: tipoActualizado
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      mensaje: 'Error al actualizar el tipo',
      error: error.message
    });
  }
};

// Eliminar un tipo
const eliminarTipo = async (req, res) => {
  try {
    const tipo = await Tipo.findById(req.params.id);
    
    if (!tipo) {
      return res.status(404).json({
        success: false,
        mensaje: 'Tipo no encontrado'
      });
    }

    await Tipo.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      mensaje: 'Tipo eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar el tipo',
      error: error.message
    });
  }
};

module.exports = {
  obtenerTipos,
  obtenerTipo,
  crearTipo,
  actualizarTipo,
  eliminarTipo
};