const express = require('express');
const router = express.Router();
const {
  obtenerGeneros,
  obtenerGenero,
  crearGenero,
  actualizarGenero,
  eliminarGenero
} = require('../controllers/generoController');

router.get('/', obtenerGeneros);
router.get('/:id', obtenerGenero);
router.post('/', crearGenero);
router.put('/:id', actualizarGenero);
router.delete('/:id', eliminarGenero);

module.exports = router;