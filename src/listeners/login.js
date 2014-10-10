module.exports.listen = function (io, socket, wordWar) {
  var users = wordWar.users;
  var userNamesBySIDs = wordWar.userNamesBySIDs;

  socket.on('login', function (name) {

    if (typeof name !== 'string') {
      return socket.emit('sorry', 'Name must be a string.');
    }

    console.log(name + ' is with us.');

    userNamesBySIDs[socket.id] = name;

    if (!users[name]) {
      wordWar.userCount++;
      users[name] = {
        id: wordWar.userCount,
        name: name,
        connected: true,
        score: 0,
        avatar: wordWar.avatarPicker.pickRandomAvatar()
      };
    } else {
      users[name].connected = true;
    }

    io.emit('userLoggedIn', users[name]);
  });
};