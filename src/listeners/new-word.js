module.exports.listen = function (io, socket, wordWar) {

  var users = wordWar.users;

  socket.on('newWord', function (word) {

    if (typeof word !== 'string') {
      return socket.emit('sorry', 'Word must be a string.');
    }

    console.log('New word suggested: ' + word);

    var name = wordWar.userNamesBySIDs[socket.id];

    if (!name) {
      return socket.emit('sorry', 'I don\'t know you.');
    }

    var user = users[name];

    var wordOk = true;

    if (!wordWar.wordService.verifyLetters(word)) {
      socket.emit('wordInvalid', word);
      wordOk = false;
    } else if (wordWar.wordService.wordTaken(word)) {
      socket.emit('wordTaken', word);
      wordOk = false;
    } else if (!wordWar.wordService.validWord(word)) {
      socket.emit('wordInvalid', word);
      wordOk = false;
    }

    if (wordOk) {
      var wordClass = wordWar.wordService.getWordClass(word);
      var score = wordWar.wordService.valueWord(word);

      wordWar.wordService.takeWord(word);

      console.log('Word OK: ' + word + ' ' + name + ' $' + score);

      user.score += score;
      io.emit('wordOk', { word: word, wordClass: wordClass, user: user, wordScore: score });

    } else {
      console.log('Word failed: ' + word + ' ' + name + ' -$1');
      user.score -= 1;
    }

    io.emit('scoreUpdate', user);
  });
};