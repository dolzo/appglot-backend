// Conexion a mongo
const connection = require('./database/connection');

// Variables de entorno
require('dotenv').config();

// Dependencias
const express = require('express');
const cors = require('cors');

// Conectarse a mongo
connection();

// Inicio
console.log('Ret2Go!!');

// Servidor en node
const app = express();
const port = process.env.port;

// Configurar cors
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cargar configuracion de rutas
//const textRoutes = require('./routes/text');
//const audioRoutes = require('./routes/audio');
const file = require('./routes/file');
const translate = require('./routes/translate');
const user = require('./routes/user');

// TODO: completar las rutas
/*
app.use('/api/text', textRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/file', fileRoutes);
*/
app.use('/api/translate', translate);
app.use('/api/file', file);
app.use('/api/user', user);

// Ruta de pruebas
app.get('/', (req, res) => {
    return res.status(200).send({
        message: 'hola :p',
    });
});

// Escuchar prticiones http
app.listen(port, () => {
    console.log(`Escuchando al puerto ${port}`);
});

// Ocultar mensaje de mantenimiento de aws
process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = '1';
