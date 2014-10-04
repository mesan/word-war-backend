var timeRemaining = require('./time-remaining');

module.exports.emit = function (io, wordWar) {

  wordWar.remainingTime = wordWar.roundDuration;

  var letters = wordWar.service.changeLetters(wordWar.letterCount);

  io.emit('newRound', letters);

  console.log('New round: ', letters.join(', '));

  timeRemaining.emit(io, wordWar);
};