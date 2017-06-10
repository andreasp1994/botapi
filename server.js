var express = require('express'),
  app = express(),
  port = process.env.PORT || 1337;

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());


var routes = require('./api/routes/routes');
routes(app);

app.listen(port);

console.log('Botchat Interledger RESTful API server started on: ' + port);
