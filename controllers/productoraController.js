const Productora = require('../models/Productora');

// Obtener todas las productoras
const obtenerProductoras = async (req, res) => {
  try {
    const { estado } = req.query;
    let filtro = {};
    
    if (estado) {
      filtro.estado = estado;
    }
    
    const productoras = await Productora.find(filtro).sort({ fechaCreacion: -1 });
    res.json({
      success: true,
      data: productoras,
      count: productoras.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener las productoras',
      error: error.message
    });
  }
};

// Obtener una productora por ID
const obtenerProductora = async (req, res) => {
  try {
    const productora = await Productora.findById(req.params.id);
    
    if (!productora) {
      return res.status(404).json({
        success: false,
        mensaje: 'Productora no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: productora
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener la productora',
      error: error.message
    });
  }
};

// Crear una nueva productora
const crearProductora = async (req, res) => {
  try {
    const { nombre, slogan, descripcion, estado } = req.body;
    
    // Validar que el nombre no exista
    const productoraExistente = await Productora.findOne({ nombre });
    if (productoraExistente) {
      return res.status(400).json({
        success: false,
        mensaje: 'Ya existe una productora con ese nombre'
      });
    }
    
    const productora = new Productora({
      nombre,
      slogan,
      descripcion,
      estado: estado || 'Activo'
    });

    const nuevaProductora = await productora.save();
    
    res.status(201).json({
      success: true,
      mensaje: 'Productora creada exitosamente',
      data: nuevaProductora
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      mensaje: 'Error al crear la productora',
      error: error.message
    });
  }
};

// Actualizar una productora
const actualizarProductora = async (req, res) => {
  try {
    const { nombre, slogan, descripcion, estado } = req.body;
    
    const productora = await Productora.findById(req.params.id);
    if (!productora) {
      return res.status(404).json({
        success: false,
        mensaje: 'Productora no encontrada'
      });
    }

    // Validar que el nuevo nombre no exista (si se está cambiando)
    if (nombre && nombre !== productora.nombre) {
      const productoraExistente = await Productora.findOne({ nombre });
      if (productoraExistente) {
        return res.status(400).json({
          success: false,
          mensaje: 'Ya existe una productora con ese nombre'
        });
      }
      productora.nombre = nombre;
    }
    
    if (slogan !== undefined) productora.slogan = slogan;
    if (descripcion !== undefined) productora.descripcion = descripcion;
    if (estado !== undefined) productora.estado = estado;

    const productoraActualizada = await productora.save();
    
    res.json({
      success: true,
      mensaje: 'Productora actualizada exitosamente',
      data: productoraActualizada
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      mensaje: 'Error al actualizar la productora',
      error: error.message
    });
  }
};

// Eliminar una productora
const eliminarProductora = async (req, res) => {
  try {
    const productora = await Productora.findById(req.params.id);
    
    if (!productora) {
      return res.status(404).json({
        success: false,
        mensaje: 'Productora no encontrada'
      });
    }

    await Productora.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      mensaje: 'Productora eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar la productora',
      error: error.message
    });
  }
};

module.exports = {
  obtenerProductoras,
  obtenerProductora,
  crearProductora,
  actualizarProductora,
  eliminarProductora
};