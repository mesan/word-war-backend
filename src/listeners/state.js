module.exports.listen = function (io, socket, wordWar) {
  socket.on('state', function () {
    socket.emit('currentState', {
      users: wordWar.users,
      letters: wordWar.wordService.getCurrentLetters()
    });
  });
};