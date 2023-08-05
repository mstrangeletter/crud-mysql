const mysql = require('mysql');
const express = require('express');
const app = express();
const port = 3001;
const myconn = require('express-myconnection');
const cors = require('cors');
const path = require('path');


const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.get('/public/dbimages', express.static(path.join(__dirname, '/public/dbimages')));


app.use(cors(corsOptions));

app.use(
  myconn(mysql, {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'YND7pArrb',
    database: 'flags',
  })
);

app.use(require('./router/route'));

app.listen(port, () => {
  console.log('corriendo en el puerto', port);
});
