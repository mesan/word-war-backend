module.exports.create = function () {
  var express     = require('express');
  var app         = express();
  var http        = require('http').Server(app);
  app.io          = require('socket.io')(http);
  var port        = process.env.PORT || 3000;

  app.use(express.static('./public'));

  app.io.set('origins', '*localhost:*');

  http.listen(port, function() {
    console.log('Listening to port ' + port + '.');
  });

  return app;
};