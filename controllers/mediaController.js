const Media = require('../models/Media');
const Genero = require('../models/Genero');
const Director = require('../models/Director');
const Productora = require('../models/Productora');
const Tipo = require('../models/Tipo');

// Obtener todas las producciones
const obtenerMedias = async (req, res) => {
  try {
    const {
      genero, director, productora, tipo, anio, titulo, page = 1, limit = 10
    } = req.query;
    
    let filtro = {};
    
    if (genero) filtro.genero = genero;
    if (director) filtro.director = director;
    if (productora) filtro.productora = productora;
    if (tipo) filtro.tipo = tipo;
    if (anio) filtro.anioEstreno = anio;
    if (titulo) {
      filtro.titulo = { $regex: titulo, $options: 'i' };
    }
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { fechaCreacion: -1 },
      populate: ['genero', 'director', 'productora', 'tipo']
    };
    
    const medias = await Media.paginate(filtro, options);
    
    res.json({
      success: true,
      data: medias.docs,
      total: medias.totalDocs,
      page: medias.page,
      pages: medias.totalPages,
      limit: medias.limit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener las producciones',
      error: error.message
    });
  }
};

// Obtener una producción por ID
const obtenerMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id)
      .populate('genero')
      .populate('director')
      .populate('productora')
      .populate('tipo');
    
    if (!media) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producción no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: media
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener la producción',
      error: error.message
    });
  }
};

// Crear una nueva producción
const crearMedia = async (req, res) => {
  try {
    const {
      serial, titulo, sinopsis, url, imagenPortada, anioEstreno,
      genero, director, productora, tipo
    } = req.body;
    
    // Validar que el serial no exista
    const mediaExistenteSerial = await Media.findOne({ serial });
    if (mediaExistenteSerial) {
      return res.status(400).json({
        success: false,
        mensaje: 'Ya existe una producción con ese serial'
      });
    }
    
    // Validar que la URL no exista
    const mediaExistenteUrl = await Media.findOne({ url });
    if (mediaExistenteUrl) {
      return res.status(400).json({
        success: false,
        mensaje: 'Ya existe una producción con esa URL'
      });
    }
    
    // Validar que el género exista y esté activo
    const generoExistente = await Genero.findById(genero);
    if (!generoExistente || generoExistente.estado !== 'Activo') {
      return res.status(400).json({
        success: false,
        mensaje: 'El género seleccionado no existe o no está activo'
      });
    }
    
    // Validar que el director exista y esté activo
    const directorExistente = await Director.findById(director);
    if (!directorExistente || directorExistente.estado !== 'Activo') {
      return res.status(400).json({
        success: false,
        mensaje: 'El director seleccionado no existe o no está activo'
      });
    }
    
    // Validar que la productora exista y esté activa
    const productoraExistente = await Productora.findById(productora);
    if (!productoraExistente || productoraExistente.estado !== 'Activo') {
      return res.status(400).json({
        success: false,
        mensaje: 'La productora seleccionada no existe o no está activa'
      });
    }
    
    // Validar que el tipo exista
    const tipoExistente = await Tipo.findById(tipo);
    if (!tipoExistente) {
      return res.status(400).json({
        success: false,
        mensaje: 'El tipo seleccionado no existe'
      });
    }
    
    const media = new Media({
      serial,
      titulo,
      sinopsis,
      url,
      imagenPortada,
      anioEstreno,
      genero,
      director,
      productora,
      tipo
    });

    const nuevaMedia = await media.save();
    await nuevaMedia.populate(['genero', 'director', 'productora', 'tipo']);
    
    res.status(201).json({
      success: true,
      mensaje: 'Producción creada exitosamente',
      data: nuevaMedia
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      mensaje: 'Error al crear la producción',
      error: error.message
    });
  }
};

// Actualizar una producción
const actualizarMedia = async (req, res) => {
  try {
    const {
      serial, titulo, sinopsis, url, imagenPortada, anioEstreno,
      genero, director, productora, tipo
    } = req.body;
    
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producción no encontrada'
      });
    }

    // Validar que el nuevo serial no exista (si se está cambiando)
    if (serial && serial !== media.serial) {
      const mediaExistenteSerial = await Media.findOne({ serial });
      if (mediaExistenteSerial) {
        return res.status(400).json({
          success: false,
          mensaje: 'Ya existe una producción con ese serial'
        });
      }
      media.serial = serial;
    }
    
    // Validar que la nueva URL no exista (si se está cambiando)
    if (url && url !== media.url) {
      const mediaExistenteUrl = await Media.findOne({ url });
      if (mediaExistenteUrl) {
        return res.status(400).json({
          success: false,
          mensaje: 'Ya existe una producción con esa URL'
        });
      }
      media.url = url;
    }
    
    // Validar referencias si se están cambiando
    if (genero && genero !== media.genero.toString()) {
      const generoExistente = await Genero.findById(genero);
      if (!generoExistente || generoExistente.estado !== 'Activo') {
        return res.status(400).json({
          success: false,
          mensaje: 'El género seleccionado no existe o no está activo'
        });
      }
      media.genero = genero;
    }
    
    if (director && director !== media.director.toString()) {
      const directorExistente = await Director.findById(director);
      if (!directorExistente || directorExistente.estado !== 'Activo') {
        return res.status(400).json({
          success: false,
          mensaje: 'El director seleccionado no existe o no está activo'
        });
      }
      media.director = director;
    }
    
    if (productora && productora !== media.productora.toString()) {
      const productoraExistente = await Productora.findById(productora);
      if (!productoraExistente || productoraExistente.estado !== 'Activo') {
        return res.status(400).json({
          success: false,
          mensaje: 'La productora seleccionada no existe o no está activa'
        });
      }
      media.productora = productora;
    }
    
    if (tipo && tipo !== media.tipo.toString()) {
      const tipoExistente = await Tipo.findById(tipo);
      if (!tipoExistente) {
        return res.status(400).json({
          success: false,
          mensaje: 'El tipo seleccionado no existe'
        });
      }
      media.tipo = tipo;
    }
    
    if (titulo !== undefined) media.titulo = titulo;
    if (sinopsis !== undefined) media.sinopsis = sinopsis;
    if (imagenPortada !== undefined) media.imagenPortada = imagenPortada;
    if (anioEstreno !== undefined) media.anioEstreno = anioEstreno;

    const mediaActualizada = await media.save();
    await mediaActualizada.populate(['genero', 'director', 'productora', 'tipo']);
    
    res.json({
      success: true,
      mensaje: 'Producción actualizada exitosamente',
      data: mediaActualizada
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      mensaje: 'Error al actualizar la producción',
      error: error.message
    });
  }
};

// Eliminar una producción
const eliminarMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producción no encontrada'
      });
    }

    await Media.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      mensaje: 'Producción eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar la producción',
      error: error.message
    });
  }
};

module.exports = {
  obtenerMedias,
  obtenerMedia,
  crearMedia,
  actualizarMedia,
  eliminarMedia
};