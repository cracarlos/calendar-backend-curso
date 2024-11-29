const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/Usuarios');
const { generarJWT } = require('../helpers/jwt');

// Response se la agrega al res solo para que me tipe todos los metodos que tenga, el response sigue funcionando igual

const crearUsuarios = async( req, res = response) => {

    const { email, password} = req.body;
    try {
        
        let usuario = await Usuario.findOne({ email });
        
        console.log(usuario);
        
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya ha sido utilizado'
            });
        }
        
        usuario = new Usuario( req.body );

        // Encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        // Guardar usuario
        await usuario.save();

        // Generar Token
        const token = await generarJWT( usuario.id, usuario.name );

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el adminsitrador'
        })
    }

};

const loginUsuarios = async( req, res = response) => {

    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ email });
        
        
        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Email no registrado, registrese para poder continuar'
            });
        }

         // Confirmar passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'password incorrecto'
            });
        };

        // Generar token
        const token = await generarJWT( usuario.id, usuario.name );

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el adminsitrador'
        })
    }

   
};

const revalidarToken = async( req, res = response) => {

    const uid = req.uid;
    const name = req.name;

    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        uid,
        name,
        token
    })
};

module.exports = {
    crearUsuarios,
    loginUsuarios,
    revalidarToken
};