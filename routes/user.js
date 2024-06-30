// Dependencias
const express = require('express');
const auth = require('../middleware/auth');

// Cargar router
const router = express.Router();

// Importar controladores
const userController = require('../controllers/user');

// Rutas

router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
