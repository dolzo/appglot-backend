// Dependencias
const express = require('express');
const multer = require('multer');

// Cargar router
const router = express.Router();

// Importar controladores
const translator = require('../controllers/translateText');

// Rutas
router.post('/translate-text/:lang/:text', translator.translateText);

module.exports = router;
