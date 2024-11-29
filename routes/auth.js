/*
    Rutas de Usuarios /auth
    host + /api/auth

*/

const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { crearUsuarios, loginUsuarios, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

router.post('/new',
    [// Middleware
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El correo es obligatorio').isEmail(),
        check('password', 'El password debe de tener almenos 6 caracteres').isLength({ min: 6 }),
        validarCampos

    ],
    crearUsuarios );

router.post('/', 
    [// Middleware
        check('email', 'El correo es obligatorio').isEmail(),
        check('password', 'El password debe de tener almenos 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuarios);

router.get('/renew', validarJWT , revalidarToken );

module.exports = router;