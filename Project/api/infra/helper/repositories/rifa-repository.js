
const mongoose = require('mongoose');

const RifaSchema = new mongoose.Schema({

        address : {
            type: String,
            required: true
        },
       /* name : {
            type: String,
            
        },
        description : {
            type: String,
           
        },
        quantidadeEntradas : {
            type: Number,
            required: true
        },*/
        valorEntrada : {
            type: Number,
            required: true
        },

        maxEntradas : {
            type: Number,
            required: true        
        }
});

module.exports = mongoose.model('RifaSchema', RifaSchema);
