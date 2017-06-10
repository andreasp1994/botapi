var express = require('express'),
  app = express(),
  port = process.env.PORT || 1337;
  
var bodyParser = require ('body-parser')
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(bodyParser.json());

var routes = require('./api/routes/routes');
routes(app);

app.listen(port);

console.log('Botchat Interledger RESTful API server started on: ' + port);
