'use strict';

var express     = require('express');
var app         = express();
var http        = require('http').Server(app);
var io          = require('socket.io')(http);

var lineReader  = require('line-reader');
var wordReader  = require('./words/word-reader');

var words;

var round = 30000; // ms
var remainingTime = round;
var userCount = 0;
var users = {};
var wordFile = 'NSF-ordlisten.txt';

app.use(express.static('./public'));

http.listen(3000, function() {
  console.log('Listening to port 3000.');
});

function sendLetters(dictionary) {
  var letters = require('./words/letter-points.json');
  words = require('./words/words')(dictionary, letters);
  var lettersResponse = JSON.stringify({ letters: words.changeLetters(30) });
  console.log(lettersResponse);
  io.emit('new round', lettersResponse);
  remainingTime = round;
  sendRemainingTime();
}

function sendRemainingTime() {
  console.log(remainingTime);
  io.emit('remaining time', remainingTime/1000);
  if (remainingTime <= 0.001) {
    sendLetters();
  } else {
    remainingTime -= 1000;
    setTimeout(sendRemainingTime, 1000);
  }
}

io.on('connection', function(socket) {
  var myname;

  console.log('A user has joined us.');
  socket.emit('connected', 'Welcome Word War!');

  // Logg inn med 'jeg er'
  socket.on('i am', function(name) {
    myname = name;
    console.log(myname + ' is with us.');

    if (!users[myname]) {
      userCount++;
      users[myname] = { name: myname, score: 0, connected: true, id: userCount };
    } else {
      users[myname].connected = true;
    }
    io.emit('welcome', JSON.stringify(users[myname]));
  });

  socket.on('current state', function() {
    socket.emit('state', JSON.stringify({ users: users, letters: words.currentLetters() }));
  });

  socket.on('word', function(word) {
    if (!myname) {
      socket.emit('sorry', 'I don\'t know you.');
      return false;
    }

    var wordInfo = words.verifyWord(word);

    if (wordInfo) {
      var score = wordInfo.score;
      var wordClass = wordInfo.wordClass;

      console.log('Word taken: ' + word + ' ' + myname + ' $' + score);
      users[myname].score += score;
      io.emit('word taken', JSON.stringify({ word: word, wordClass: wordClass }));
      io.emit('score update', JSON.stringify(users[myname]));
    } else {
      console.log(myname + ' -$1');
      users[myname].score -= 1;
      io.emit('score update', JSON.stringify(users[myname]));
    }
  });

  socket.on('disconnect', function() {
    if (myname) {
      if (users[myname]) {
        users[myname].connected = false;
        io.emit('goodbye', JSON.stringify(users[myname]));
      }
      console.log(myname + ' has left us.');
    } else {
      console.log('A user has left us.');
    }
  });
});

wordReader(lineReader, wordFile, sendLetters);

