// Dependencias
const translate = require('@vitalets/google-translate-api');

// Traducir texto
const translateText = async (req, res) => {
    const text = req.params.text;
    const lang = req.params.lang;
    if (!text || !lang) {
        return res.status(404).send({
            status: 'error',
            message:
                'No se han proporcionado los parámetros de lenguaje o de texto',
        });
    }

    try {
        translatedText = await translate.translate(text, {
            to: lang,
        });
    } catch (e) {
        return res.status(500).send({
            status: 'error',
            message: 'Ha ocurrido un error al traducir',
            error: e,
        });
    }

    return res.status(200).send({
        status: 'ok',
        translated: translatedText.text,
    });
};

module.exports = translateText;
