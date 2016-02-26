'use strict';

//
// Create the HTTP server and serve our index.html
//
var server = require('http').createServer(function incoming(req, res) {
  res.setHeader('Content-Type', 'text/html');
  require('fs').createReadStream(__dirname + '/index.html').pipe(res);
});

//
// Attach Primus to the HTTP server.
//
var Primus = require('primus')
  , primus = new Primus(server);

//
// Listen for connections and echo the events send.
//
primus.on('connection', function connection(spark) {
  primus.write(spark.id + ' connected.');
  spark.on('data', function received(data) {
    console.log(spark.id, 'received message:', data);
    primus.write(data);
  });
});

var port = process.env.PORT || 1337;
server.listen(port, function () {
  console.log('Server running');
});