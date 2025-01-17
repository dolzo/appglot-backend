// Dependecias
const validator = require('validator');

// Funcion para validar el registro
const validateRegister = (params) => {
    let name =
        !validator.isEmpty(params.name) &&
        validator.isLength(params.name, { min: 3, max: undefined }) &&
        validator.isAlpha(params.name, 'es-ES');

    let surname =
        !validator.isEmpty(params.surname) &&
        validator.isLength(params.surname, { min: 2, max: undefined }) &&
        validator.isAlpha(params.surname, 'es-ES');

    let email =
        !validator.isEmpty(params.email) && validator.isEmail(params.email);

    // Requiere:
    // Longitud >= 8
    // Minimo de 1 minuscula - 1 mayuscula - 1 numero
    let password =
        !validator.isEmpty(params.password) &&
        validator.isStrongPassword(params.password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0,
        });

    if (!name || !surname || !email || !password) {
        throw new Error('No se ha superado la validacion');
    }
};

// Funcion para validar un email
const validateEmail = (email) => {
    let emailOk = !validator.isEmpty(email) && validator.isEmail(email);

    if (!emailOk) {
        throw new Error('Email no valido');
    }
};

module.exports = { validateRegister, validateEmail };
