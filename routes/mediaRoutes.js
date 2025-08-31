const express = require('express');
const router = express.Router();
const {
  obtenerMedias,
  obtenerMedia,
  crearMedia,
  actualizarMedia,
  eliminarMedia
} = require('../controllers/mediaController');

router.get('/', obtenerMedias);
router.get('/:id', obtenerMedia);
router.post('/', crearMedia);
router.put('/:id', actualizarMedia);
router.delete('/:id', eliminarMedia);

module.exports = router;