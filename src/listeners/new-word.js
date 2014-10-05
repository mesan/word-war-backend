module.exports.listen = function (io, socket, wordWar) {

  var users = wordWar.users;

  socket.on('newWord', function (word) {

    console.log('New word suggested: ' + word);

    var name = wordWar.userNamesBySIDs[socket.id];

    if (!name) {
      return socket.emit('sorry', 'I don\'t know you.');
    }

    var wordInfo = wordWar.service.verifyWord(word);

    var user = users[name];

    if (wordInfo) {
      var score = wordInfo.score;
      var wordClass = wordInfo.wordClass;

      console.log('Word taken: ' + word + ' ' + name + ' $' + score);

      user.score += score;
      io.emit('wordTaken', { word: word, wordClass: wordClass, user: user, wordScore: score });
    } else {
      console.log(name + ' -$1');
      user.score -= 1;
    }

    io.emit('scoreUpdate', user);
  });
};