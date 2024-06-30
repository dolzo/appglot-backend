// Dependencias
const express = require('express');
const auth = require('../middleware/auth');

// Cargar router
const router = express.Router();

// Importar controladores
const translator = require('../controllers/translateText');

// Rutas
router.post('/translate-text/:lang/:text', auth, translator.translateText);

module.exports = router;
