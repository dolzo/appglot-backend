// Dependencias
const express = require('express');
const multer = require('multer');

// Cargar router
const router = express.Router();

// Importar controladores
const file = require('../controllers/file');

// Rutas
router.post('/upload-file', file.uploadMulter, file.uploadFile);
router.post('/translate-file/:lang/:imageName', file.translateFile);

module.exports = router;
