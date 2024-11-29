const path = require('path');
const express = require('express');
var cors = require('cors')
const { dbConnection } = require('./database/config');
require('dotenv').config();

// console.log( process.env );
// Crear el servidor de express
const app = express();

// Bases de datos
dbConnection();

// CORS
app.use(cors())

// Directorio Publico
app.use( express.static('public') );

// Lectura y parseo del body
app.use( express.json());

// Rutas
app.use('/api/auth', require('./routes/auth') );
app.use('/api/events', require('./routes/events') );

// Esto es para cuando el cliente refresque la pagina fuera del router no le salga que no pueda conseguir la direccion
// Es una alternativa mejor a la ( # ) 
app.use('*', ( req, res ) => {
    res.sendFile( path.join(__dirname, 'public/index.html' ));
})

// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${ process.env.PORT }`)
});