// Dependencias
const AWS = require('aws-sdk');
const fs = require('fs');
const fsx = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const tesseract = require('tesseract.js');
const multerS3 = require('multer-s3');
const multer = require('multer');

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
            cb(null, Date.now().toString() + path.extname(file.originalname));
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

    return res.status(200).send({
        status: 'ok',
        message: 'Archivo subido',
    });
};

module.exports = { uploadMulter, uploadFile };
