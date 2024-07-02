// Dependencias
const jwt = require('jwt-simple');
const moment = require('moment');

// Importar clave secreta
const libjwt = require('../helpers/jwt');
const secret = libjwt.secret;

// Middleware de autenticacionD
const auth = (req, res, next) => {
    // Comprobar si llega la cabecera de autenticacion
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: 'error',
            message: 'La peticion carece de cabecera de autenticacion',
        });
    }

    // Limpiar el token con regex
    const token = req.headers.authorization.replace(/['"]+/g, '');

    // Decodificar el token
    try {
        const payload = jwt.decode(token, secret);

        // Verificar expiracion del token
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                status: 'error',
                message: 'Token expirado',
            });
        }

        // Agregar datos de usuario a la request
        req.user = payload;
    } catch (e) {
        return res.status(404).send({
            status: 'error',
            message: 'El token es invalido',
            error: e.message,
        });
    }

    // Ejecutar la accion
    next();
};

module.exports = auth;
