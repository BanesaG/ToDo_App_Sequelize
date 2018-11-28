const express = require('express');
const bodyParser = require("body-parser");
// const mongoose = require("mongoose");

const app = express();
const server = require('http').createServer(app); 
const io = require('socket.io')(server);

const PORT = process.env.PORT || 8080;

const db = require("./model");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

//update with mylab user and password//
// mongoose.connect('mongodb://socketapp:1234sk@ds137483.mlab.com:37483/heroku_78t5nvpt', { useNewUrlParser: true });

require('./sockets/todo-sockets')(io);
require('./routes/api-routes.js')(app);
require('./routes/html-routes.js')(app);

// server.listen((process.env.PORT || 8080), () => {console.log(`App is now listening on PORT ${PORT}`)});
db.sequelize.sync({ force: true }).then(function() {
    server.listen(PORT, function() {
      console.log("App listening on PORT " + PORT);
    });
  });