const mongoose = require('mongoose');

const RifaSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    valorEntrada: {
        type: Number,
        required: true
    },
    maxEntradas: {
        type: Number,
        required: true        
    },
    entradasRestantes: {
        type: Number,
        required: true
    },
    sorteioRealizado: {
        type: Boolean,
        required: true,
        default: false
    },
    tokensAcumulados: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('Rifa', RifaSchema);
