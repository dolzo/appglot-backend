// Dependencias
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('../helpers/jwt');
const validate = require('../helpers/validate');

// Registro de usuarios
const register = async (req, res) => {
    // Recoger parametros
    const params = req.body;

    // Comprobar que los datos lleguen bien
    if (!params.name || !params.surname || !params.email || !params.password) {
        return res.status(404).send({
            status: 'error',
            message: 'No se han provisto de los parametros necesarios',
        });
    }

    // Validacion avanzada
    try {
        validate.validateRegister(params);
    } catch (e) {
        return res.status(400).send({
            status: 'error',
            message: 'Validacion de usuario no superada',
        });
    }

    // Buscar si existe el usuario - usuarios duplicados
    const existingUser = await User.find({
        $or: [{ email: params.email.toLowerCase() }],
    }).exec();

    if (existingUser && existingUser.length >= 1) {
        return res.status(200).send({
            status: 'error',
            message: 'El usuario ya existe',
        });
    }

    // Cifrar la password
    const cypheredPassword = await bcrypt.hash(params.password, 10);
    params.password = cypheredPassword;

    // Crear objeto del usuario
    const userToSave = new User(params);

    // Guardar usuario en mongo
    userToSave
        .save()
        .then((user) => {
            // Limpiar el objeto a devolver

            return res.status(200).send({
                status: 'ok',
                message: 'Usuario guardado exitosamente',
                user,
            });
        })
        .catch((e) => {
            return res.status(500).send({
                status: 'error',
                message: 'Ha ocurrido un error al guardar el usuario',
                error: e,
            });
        });
};

// Login de usuario
const login = async (req, res) => {
    // Recoger parametros
    const params = req.body;

    // Comprobar que lleguen los parametros
    if (!params.email || !params.password) {
        return res.status(404).send({
            status: 'error',
            message: 'No se han provisto de los parametros necesarios',
        });
    }

    // Buscar en mongo si existe el usuario
    const userFound = await User.findOne({ email: params.email })
        .select('+password')
        .exec();

    if (!userFound) {
        return res.status(400).send({
            status: 'error',
            message: 'El email o la clave no esta correcto',
        });
    }

    // Comprobar la password
    const passwordMatch = bcrypt.compareSync(
        params.password,
        userFound.password
    );

    if (!passwordMatch) {
        return res.status(400).send({
            status: 'error',
            message: 'El email o la clave no esta correcto',
        });
    }

    // Conseguir token
    const token = jwt.createToken(userFound);

    // Devolver datos del usuario
    return res.status(200).send({
        status: 'ok',
        message: 'Login exitoso',
        user: userFound,
        token,
    });
};

const getUser = async (req, res) => {
    // Recibir parametros
    const params = req.params;

    // Validar parametros
    try {
        validate.validateEmail(params.email);
    } catch (e) {
        return res.status(400).send({
            status: 'error',
            message: 'El correo proporcionado no es valido',
        });
    }

    // Buscar en mongo si existe el usuario
    const userFound = await User.findOne({ email: params.email })
        .select('-password')
        .exec();

    // Si no hay usuarios, indicarlo
    if (!userFound) {
        return res.status(200).send({
            status: 'ok',
            message: 'No hay usuario con el email proporcionado',
        });
    }

    // Devolver el usuario
    return res.status(200).send({
        status: 'ok',
        userFound,
    });
};

module.exports = { register, login, getUser };
