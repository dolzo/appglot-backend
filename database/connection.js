// Declarar mongoose
const mongoose = require('mongoose');

// Conexion
const connection = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/appglot');
        console.log('Conectado a mongo');
    } catch (e) {
        console.log(e);
        throw new Error('No se ha podido conectar a mongo');
    }
};

module.exports = connection;
