module.exports.listen = function (io, socket, wordWar) {
  var users = wordWar.users;
  var userNamesBySIDs = wordWar.userNamesBySIDs;

  socket.on('login', function (name) {

    console.log(name + ' is with us.');

    userNamesBySIDs[socket.id] = name;

    if (!users[name]) {
      wordWar.userCount++;
      users[name] = { name: name, score: 0, connected: true, id: wordWar.userCount };
    } else {
      users[name].connected = true;
    }

    io.emit('userLoggedIn', users[name]);
  });
};