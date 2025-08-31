const Director = require('../models/Director');

// Obtener todos los directores
const obtenerDirectores = async (req, res) => {
  try {
    const { estado } = req.query;
    let filtro = {};
    
    if (estado) {
      filtro.estado = estado;
    }
    
    const directores = await Director.find(filtro).sort({ fechaCreacion: -1 });
    res.json({
      success: true,
      data: directores,
      count: directores.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener los directores',
      error: error.message
    });
  }
};

// Obtener un director por ID
const obtenerDirector = async (req, res) => {
  try {
    const director = await Director.findById(req.params.id);
    
    if (!director) {
      return res.status(404).json({
        success: false,
        mensaje: 'Director no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: director
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener el director',
      error: error.message
    });
  }
};

// Crear un nuevo director
const crearDirector = async (req, res) => {
  try {
    const { nombres, estado } = req.body;
    
    const director = new Director({
      nombres,
      estado: estado || 'Activo'
    });

    const nuevoDirector = await director.save();
    
    res.status(201).json({
      success: true,
      mensaje: 'Director creado exitosamente',
      data: nuevoDirector
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      mensaje: 'Error al crear el director',
      error: error.message
    });
  }
};

// Actualizar un director
const actualizarDirector = async (req, res) => {
  try {
    const { nombres, estado } = req.body;
    
    const director = await Director.findById(req.params.id);
    if (!director) {
      return res.status(404).json({
        success: false,
        mensaje: 'Director no encontrado'
      });
    }

    if (nombres !== undefined) director.nombres = nombres;
    if (estado !== undefined) director.estado = estado;

    const directorActualizado = await director.save();
    
    res.json({
      success: true,
      mensaje: 'Director actualizado exitosamente',
      data: directorActualizado
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      mensaje: 'Error al actualizar el director',
      error: error.message
    });
  }
};

// Eliminar un director
const eliminarDirector = async (req, res) => {
  try {
    const director = await Director.findById(req.params.id);
    
    if (!director) {
      return res.status(404).json({
        success: false,
        mensaje: 'Director no encontrado'
      });
    }

    await Director.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      mensaje: 'Director eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar el director',
      error: error.message
    });
  }
};

module.exports = {
  obtenerDirectores,
  obtenerDirector,
  crearDirector,
  actualizarDirector,
  eliminarDirector
};