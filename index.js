require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection }  = require('./database/config')

const app = express(); 

//Config Cors
app.use( cors() );


//Base de Datos
dbConnection();

console.log(process.env);

app.get('/',  (req, res) => { 
        res.status(400).json({
            ok:true,
            msg: 'HOla Mundo1'
        }
        );
} );


app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
} )

