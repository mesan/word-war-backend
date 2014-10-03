var words = require('./words');
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

var round = 30000; // ms
var userCount = 0;
var users = {};
var wordFile = "NSF-ordlisten.txt";

app.use(express.static('./public'));

http.listen(3000, function() {
  console.log("Listening to port 3000.");
});

io.on('connection', function(socket) {
  var myname;

  console.log('A user has joined us.');
  socket.emit('connected', "Welcome Word War!");

  // Logg inn med "jeg er"
  socket.on('i am', function(name) {
    myname = name;
    console.log(myname + " is with us.");

    if (!users[myname]) {
      userCount++;
      users[myname] = { name: myname, score: 0, connected: true, id: userCount }
    } else {
      users[myname].connected = true;
    }
    io.emit("welcome", JSON.stringify(users[myname]));
  });

  socket.on('current', function() {
    socket.emit("current", JSON.stringify({ users: users, letters: words.currentLetters() }));
  });

  socket.on('word', function(word) {
    if (!myname) {
      socket.emit("sorry", "I don't know you.");
      return false;
    }

    console.log("Check word: "+word);
    words.scoreWord(word, function(word, type, score) {
      console.log("Word taken: "+word + " " + myname + " $" + score);
      users[myname].score += score;
      io.emit("word taken", JSON.stringify({ word: word, type: type }));
      io.emit("score update", JSON.stringify(users[myname]));
    }, function() {
      console.log(myname + " -$1");
      users[myname].score -= 1;
      io.emit("score update", JSON.stringify(users[myname]));
    });
  });

  socket.on('disconnect', function() {
    if (myname) {
      if (users[myname]) {
        users[myname].connected = false;
        io.emit("goodbye", JSON.stringify(users[myname]));
      }
      console.log(myname + " has left us.");
    } else {
      console.log('A user has left us.');
    }
  });
});

function sendBokstaver() {
  var letters = JSON.stringify({ bokstaver: words.changeLetters(30) });
  console.log(letters);
  io.emit("letters", letters);
  setTimeout(sendBokstaver, round);
}

words.readWordFile(wordFile, sendBokstaver);

