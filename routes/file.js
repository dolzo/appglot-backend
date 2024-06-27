// Dependencias
const express = require('express');
const multer = require('multer');

// Cargar router
const router = express.Router();

// Importar controladores
const uploadFile = require('../controllers/file');

// Rutas
router.post('/upload-file', uploadFile.uploadMulter, uploadFile.uploadFile);

module.exports = router;
