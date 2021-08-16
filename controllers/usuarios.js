const { response } = require('express');
const bcrypt = require( 'bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

 const getUsuarios = async (req, res) => { 

    const usuarios = await Usuario.find({}, 'nombre email role google ');

    res.json({
        ok: true,
        usuarios,
        uid: req.uid
    });

}

const crearUsuarios = async (req, res = response) => { 

    const {email, password} = req.body;

  
    try {

        const existeEmail = await Usuario.findOne( {email});

        if ( existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            })
        }

        const usuario = new Usuario( req.body  )

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        console.log('salt ', salt);
        usuario.password = bcrypt.hashSync(password, salt);

        //Guardar Usuario
        await usuario.save();
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log( error);
        res.status(500).json({
            ok: false,
            msg : 'error inesperado... revisar logs'
        })
    }
}


const actualizarUsuario = async (req, res = response) => { 

    const uid = req.params.id;
    
    // TODO: Validar token y comprobar si es el usuario correcto

    try {

       const usuarioDB =  await Usuario.findById(uid);
     
        if ( !usuarioDB){
            return res.status(404).json( {
                ok: false,
                msg: 'No existe un usuario por ese id'
            })
        }
                
        // Actualizaciones
        const { password, google, email, ...campos} = req.body;

        if ( usuarioDB.email !== email){

                const existeEmail = await Usuario.findOne({email});
                if (  existeEmail ){
                    return res.status(400).json( {
                        ok:false,
                        msg: 'Ya existe un Usuario con ese Email'
                    });
                }
        }        
        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, {new : true});
  
        res.json({
            ok: true,
           usuario: usuarioActualizado
        });

    } catch (error) {
        console.log( error);
        res.status(500).json({
            ok: false,
            msg : 'error inesperado... revisar logs'
        })
    }
}

const borrarUsuario = async(  req, res = response) => {

    const uid = req.params.id;
    
    try {
        
        const usuarioDB =  await Usuario.findById(uid);
     
        if ( !usuarioDB){
            return res.status(404).json( {
                ok: false,
                msg: 'No existe un usuario por ese id'
            })
        }

        await Usuario.findByIdAndDelete( uid )   ;
        
        res.json({
            ok: true, 
            msg: 'Usuario eliminado'
        });

    } catch (error) {
        console.log( error);
        res.status(500).json({
            ok: false,
            msg : 'error inesperado... revisar logs'
        })
    }
}

module.exports = { 
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario
 }