// Dependencias
const express = require('express');
const auth = require('../middleware/auth');

// Cargar router
const router = express.Router();

// Importar controladores
const translator = require('../controllers/translateText');

// Rutas
//router.post('/translate-text/', auth, translator.translateText);
router.post('/translate-text/', translator.translateText);

module.exports = router;
