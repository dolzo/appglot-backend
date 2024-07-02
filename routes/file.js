// Dependencias
const express = require('express');
const auth = require('../middleware/auth');

// Cargar router
const router = express.Router();

// Importar controladores
const file = require('../controllers/file');

// Rutas
router.post('/upload-file', auth, file.uploadMulter, file.uploadFile);
router.post('/translate-file/:lang/:imageName', auth, file.translateFile);

module.exports = router;
