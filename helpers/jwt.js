// Dependencias
const jwt = require('jwt-simple');
const moment = require('moment');

// Clave secreta
const secret =
    'o1Jicro1Q6A9ynAXB0X0axonth3wJytezaREY3ic3bOKFwqj86NChPBjxjHxJMcg';

// Generar tokens
const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        iat: moment().unix(),
        exp: moment().add(6, 'months').unix(),
    };

    // Devolver jwt token codificado
    return jwt.encode(payload, secret);
};

module.exports = { createToken, secret };
