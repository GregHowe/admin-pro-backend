const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');
const Usuario = require('../models/usuario');

const validarJWT = (  req, res, next ) => {

    const token = req.header('x-token');

    if (!token){
        return res.status(401).json({
            ok: false,
            msg : 'No hay token en la peticion'
        })
    }

    try {
        
            const {uid} = jwt.verify( token, process.env.JWT_SECRET);
            req.uid = uid;
            next();

    } catch (error) {
        
        return res.status(401).json({
            ok: false,
            msg : 'Token no valido'
        })   
    }
}

const validarADMIN_ROLE =  async(  req, res, next ) => {

        const uid = req.uid;
        try {

            const usuarioDB = await Usuario.findById( uid);

            if ( !usuarioDB){
                return res.status(404).json({
                    ok: false,
                    msg : 'Usuario no existe'
                })   
            }

            if ( usuarioDB.role !== 'ADMIN_ROLE'){
                return res.status(403).json({
                    ok: false,
                    msg : 'No tiene privilegios para hacer eso'
                })   
            }

            next(); 


        } catch (error) {
            
            return res.status(401).json({
                ok: false,
                msg : 'Hable con el admin'
            })   
            
        }

}

const validarADMIN_ROLE_o_MismoUsuario =  async(  req, res, next ) => {

   
    const uid = req.uid;
    const id = req.params.id;
    try {

        const usuarioDB = await Usuario.findById( uid);
        
        if ( !usuarioDB){
            return res.status(404).json({
                ok: false,
                msg : 'Usuario no existe'
            })   
        }
        
        if ( usuarioDB.role === 'ADMIN_ROLE' || uid === id ){
            next();
        }
        else{
            return res.status(403).json({
                ok: false,
                msg : 'No tiene privilegios para hacer eso'
            })   
        }
      
        next(); 


    } catch (error) {
        
        return res.status(401).json({
            ok: false,
            msg : 'Hable con el admin'
        })   
        
    }

}


module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_o_MismoUsuario
}