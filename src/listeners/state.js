module.exports.listen = function (socket, wordWar) {
  socket.on('state', function () {

    console.log(socket.id + ': State requested...');

    socket.emit('currentState', {
      users: wordWar.users,
      letters: wordWar.service.getCurrentLetters()
    });
  });
};