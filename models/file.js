const { Schema, model } = require('mongoose');

const FileSchema = Schema({
    fileName: {
        type: String,
        reuqired: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = model('FileSchema', FileSchema, 'files');
