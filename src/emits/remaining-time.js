var newRound = require('./new-round');

module.exports.emit = function emitRemainingTime(io, wordWar) {

  io.emit('remainingTime', wordWar.remainingTime / 1000);

  if (wordWar.remainingTime <= 0.001) {
    newRound.emit(io, wordWar);
  } else {
    wordWar.remainingTime -= 1000;
    setTimeout(function () {
      emitRemainingTime(io, wordWar);
    }, 1000);
  }
};