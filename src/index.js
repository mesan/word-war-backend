'use strict';

var app         = require('./server-creator').create();

// Listeners
var connection  = require('./listeners/connection');
var login       = require('./listeners/login');
var state       = require('./listeners/state');
var disconnect  = require('./listeners/disconnect');
var newWord     = require('./listeners/new-word');

// Emits
var newRound    = require('./emits/new-round');

// Configuration
var config      = require('./config.json');
var letters     = require('./' + config.letterFile);
var avatars     = require('./' + config.avatarFile);

// Dependencies
var wordReader  = require('./words/word-reader');

// Initialization
var wordWar = {
  users: {},
  userNamesBySIDs: {},
  userCount: 0,
  roundDuration: config.roundDuration,
  remainingTime: config.roundDuration,
  letterCount: config.letterCount
};

wordReader.read(config.wordFile, startApp);

function startApp(dictionary) {
  wordWar.wordService = require('./words/word-service')(dictionary, letters);
  wordWar.avatarPicker = require('./avatars/avatar-picker')(avatars);

  connection.listen(app.io, wordWar, onConnection);

  newRound.emit(app.io, wordWar);
}

function onConnection(socket) {
  login.listen(app.io, socket, wordWar);
  state.listen(app.io, socket, wordWar);
  newWord.listen(app.io, socket, wordWar);
  disconnect.listen(app.io, socket, wordWar);
}

