// Dependencias
const AWS = require('aws-sdk');
const path = require('path');
const multerS3 = require('multer-s3');
const multer = require('multer');
const File = require('../models/file');
const fs = require('fs');
const fsx = require('fs-extra');
const tesseract = require('tesseract.js');
const translator = require('../controllers/translateText');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
});
const s3 = new AWS.S3({
    signatureVersion: 'v4',
});

const uploadMulter = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        key: (req, file, cb) => {
            // Clave unica
            cb(
                null,
                `${file.originalname.split('.')[0]}-${Date.now().toString()}` +
                    path.extname(file.originalname)
            );
        },
    }),
}).single('file0');

const uploadFile = async (req, res) => {
    // Cargar con multer

    uploadMulter(req, res, (err) => {
        // Ignorar este error
        if (err.message === 'Unexpected end of form') {
        } else if (err) {
            // Se toma en cuneta cualquier otro error
            return res.status(400).send({
                status: 'error',
                message: 'Ha ocurrido un error al subir la imagen',
                error: err.message,
            });
        }
    });

    // Obtener url del archivo
    const fileUrl = req.file.location;

    // Modelo con datos del archivo
    const newFile = new File({
        fileName: req.file.key,
        fileUrl: fileUrl,
    });

    // Guardar instancia en mongo
    newFile
        .save()
        .then((saved) => {
            res.status(200).send({
                status: 'ok',
                message: 'Archivo subido',
                file: saved,
            });
        })
        .catch((error) => {
            res.status(500).send({
                status: 'error',
                message: 'Archivo subido',
                error: error,
            });
        });
};

const translateFile = async (req, res) => {
    // Parametros de la traduccion
    const translationLang = req.params.lang;

    // Parametros del archivo
    const imageKey = req.params.imageName;

    const originalImageName = String(imageKey).split('.')[0];
    const imageExtension = String(imageKey).split('.')[1];

    if (
        imageExtension != 'png' &&
        imageExtension != 'jpeg' &&
        imageExtension != 'jpg'
    ) {
        return res.status(500).send({
            status: 'error',
            message: 'Formato de el archivo no valido',
            imageExtension,
        });
    }

    // Si no hay parametros
    if (!req.params.imageName || !req.params.lang) {
        return res.status(404).send({
            status: 'error',
            message:
                'No se han proporcionado el parametro de la imagen o el parametro del lenguaje',
        });
    }

    // Directorio donde guardar el archivo
    const directory = `temp/${originalImageName}`;
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    const filePath = `${directory}/${imageKey}`;

    // Descargar archivo de s3 al proyecto
    const downloadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey,
    };

    // Guardar el archivo
    try {
        const data = await s3.getObject(downloadParams).promise();
        fs.writeFileSync(filePath, data.Body);
    } catch (e) {
        return res.status(500).send({
            status: 'error',
            message: 'Error al descargar el archivo de s3',
            error: e,
        });
    }

    // Para almacenar la transcripcion
    let fileText;

    // Transcribir el archivo guardado
    try {
        await tesseract
            .recognize(filePath, 'spa')
            .then(({ data: { text } }) => {
                // Borrar evidencia del archivo :D
                removeDirectory(directory);

                fileText = text;
            });
    } catch (e) {
        // Borrar evidencia del archivo :D
        removeDirectory(directory);

        return res.status(500).send({
            status: 'error',
            message: 'Error al transcribir el archivo',
            error: e,
        });
    }

    const translatedFileText = await translator.translate(
        fileText,
        translationLang
    );

    return res.status(200).send({
        status: 'ok',
        message: 'Archivo traducido exitosamente',
        res: translatedFileText.text,
    });
};

// Borrar directorio con archivos dentro
const removeDirectory = async (directoryPath) => {
    try {
        await fsx.remove(directoryPath);
    } catch (error) {
        console.log(`No se pudo borrar la carpeta: ${directoryPath}`);
    }
};

module.exports = { uploadMulter, uploadFile, translateFile };
