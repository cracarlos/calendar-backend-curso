/*
    Rutas de Eventos /events
    host + /api/events

*/

const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT } = require('../middleware/validar-jwt');
const { validarCampos } = require('../middleware/validar-campos');
const { getEventos, crearEvento, acualizarEvento, eliminarEvento } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');

const router = Router();

// Todas las rutas tienen que pasar por la validacion de JWT
// Esta  manera de aplicar un middleware afecta a todas las rutas y tiene que estar por encima de todas
router.use( validarJWT );

router.get('/',
    [
        
    ], 
    getEventos 
);

router.post('/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'La fecha de finalizacion es obligatoria').custom( isDate ),
        validarCampos
    ], 
    crearEvento 
);

router.put('/:id',
    [
        
    ], 
    acualizarEvento 
);

router.delete('/:id',
    [
        
    ], 
    eliminarEvento 
);

module.exports = router;
