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

    // Si la password no es correcta
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
    const params = req.body;

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

const updateUser = async (req, res) => {
    try {
        // Recibir usuario identificado
        const userIdentity = req.user;

        // Recibir usuario a actualizar
        const userToUpdate = req.body;

        // Comprobar si el usuario ya existe
        const usersFound = await User.find({
            $or: [{ email: userToUpdate.email.toLowerCase() }],
        }).exec();

        // Comprobar si el usuario existe y no soy yo (el identificado)
        let userIsSet = false;
        usersFound.forEach((user) => {
            if (user && user._id.toString() !== userIdentity.id) {
                userIsSet = true;
            }
        });

        // Si ya existe devolver respuesta
        if (userIsSet) {
            return res.status(200).send({
                status: 'ok',
                message: 'El correo indicado ya está en uso',
            });
        }

        // Cifrar password si es que llega
        if (userToUpdate.password) {
            const cypheredPassword = await bcrypt.hash(
                userToUpdate.password,
                10
            );
            userToUpdate.password = cypheredPassword;
        } else {
            delete userToUpdate.password;
        }

        // Buscar usuario y actualizar
        const updatedUser = await User.findByIdAndUpdate(
            { _id: userIdentity.id },
            userToUpdate,
            { new: true }
        ).exec();

        // Devolver respuesta
        return res.status(200).send({
            status: 'ok',
            message: 'Usuario actualizado',
            user: updatedUser,
        });
    } catch (e) {
        // Devolver error
        console.error('Error al actualizar el usuario:', e);
        return res.status(500).send({
            status: 'error',
            message: 'Error al actualizar el usuario',
            error: e.message,
        });
    }
};

module.exports = { register, login, getUser, updateUser };
