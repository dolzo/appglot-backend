// Dependencias
const translator = require('@vitalets/google-translate-api');

// Traducir texto
const translateText = async (req, res) => {
    const text = req.params.text;
    const lang = req.params.lang;

    try {
        const translatedText = await translate(text, lang);
        return res.status(200).send({
            status: 'ok',
            message: 'Texto traducido',
            res: translatedText.text,
        });
    } catch (e) {
        return res.status(500).send({
            status: 'error',
            message: 'No se pudo traducir el texto',
            error: e,
        });
    }
};

const translate = async (text, lang) => {
    if (!text || !lang) {
        throw new Error(
            'No se han proporcionado los parámetros de lenguaje o de texto'
        );
    }

    const translatedText = await translator.translate(text, {
        to: lang,
    });

    return translatedText;
};

module.exports = { translateText, translate };
