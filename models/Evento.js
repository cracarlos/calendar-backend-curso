const { Schema, model } = require('mongoose');

const EventoShema = Schema({
  
    title: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios',
        required: true
    }
    
});

// Para hacer modificaciones por defecto de Mongo, como la serializacion, los nombres que le pone al id, etc.

EventoShema.method('toJSON', function() {
    
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    
    return object;
});

module.exports = model( 'Evento', EventoShema );