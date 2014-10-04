module.exports.listen = function (io, wordWar, onConnection) {

  io.on('connection', function (socket) {

    console.log('A user has joined us.');

    socket.emit('connected', 'Welcome to Word War!');

    onConnection(socket);
  });
};