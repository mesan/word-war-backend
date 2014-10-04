module.exports.listen = function (io, socket, wordWar) {
  var users = wordWar.users;

  socket.on('disconnect', function () {
    var name = wordWar.userNamesBySIDs[socket.id];

    if (name) {
      if (users[name]) {
        users[name].connected = false;
        delete wordWar.userNamesBySIDs[socket.id];

        io.emit('userLoggedOut', users[name]);
      }

      console.log(name + ' has left us.');

    } else {
      console.log('A user has left us.');
    }
  });
};