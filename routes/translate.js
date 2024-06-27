// Dependencias
const express = require('express');
const multer = require('multer');

// Cargar router
const router = express.Router();

// Importar controladores
const translateText = require('../controllers/translateText');

// Rutas
router.post('/translate-text/:lang/:text', translateText);

module.exports = router;
