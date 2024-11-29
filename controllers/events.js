const { response } = require('express');
const Evento = require('../models/Evento');

const getEventos = async ( req, resp = response ) => {

    const eventos = await Evento.find().populate('user', 'name');


    return resp.status(200).json(
            {
                ok: true,
                eventos
            }
    );

};

const crearEvento = async ( req, resp = response ) => {

    const evento = new Evento( req.body );

    try {
        
        evento.user = req.uid;

        const eventoGuardado = await evento.save();
        
        resp.json({
            ok: true,
            evento: eventoGuardado
        })

    } catch (error) {
        
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error. Comuniquese con los administradores del sistema'
        })
    }
    
};

const acualizarEvento = async ( req, resp = response ) => {
    
    const eventoId = req.params.id

    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ) {
            return resp.status(400).json({
                ok: false,
                msg: 'Evento no existe'
            });
        }

        if ( evento.user.toString() !== req.uid ) {
          return resp.status(401).json({
            ok: false,
            msg: 'No tiene permisos para editar ese evento'
          });  
        };
        
        const nuevoEvento = {
            ...req.body,
            user: req.uid
        };
        // {new: true} Para que retorne el eventp actualizado, si no se coloca retorna el viejo docuemento pero si se realizo la actualizacion
        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, {new: true} );
    
        resp.json({
            ok: true,
            evento: eventoActualizado
        });
        
    } catch (error) {
        console.log(error);

        resp.status(500).json({
            ok: false,
            msg: 'Error en sistema. Consulte con el administrador'
        });
    }
    
};

const eliminarEvento = async ( req, resp = response ) => {
    
    const eventoId = req.params.id

    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ) {
            return resp.status(400).json({
                ok: false,
                msg: 'Evento no existe'
            });
        }

        if ( evento.user.toString() !== req.uid ) {
          return resp.status(401).json({
            ok: false,
            msg: 'No tiene permisos para eliminar ese evento'
          });  
        };
        
        const { title } = await Evento.findByIdAndDelete( eventoId );
    
        resp.json({
            ok: true,
            msg: `El evento "${title}" ha sido eliminado`
        });
        
    } catch (error) {
        console.log(error);

        resp.status(500).json({
            ok: false,
            msg: 'Error en sistema. Consulte con el administrador'
        });
    }

};

module.exports = {
    acualizarEvento,
    crearEvento,
    eliminarEvento,
    getEventos,
}