var lineReader = require('line-reader');
var words = require('./words');
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

var ordbok = {};
var wordFile = "NSF-ordlisten.txt";
var wordsRead = false;

var sockets = [];

app.use(express.static('./public'));

http.listen(3000, function() {
  console.log("Lytter til port 3000.");
});

io.on('connection', function(socket) {
  var jeger;

  sockets.push(socket);
  console.log('En bruker er med oss.');
  socket.emit('connected', "Velkommen til Word War!");

  socket.on('jeg er', function(melding) {
    jeger = melding;
    console.log(jeger + " er med oss.");
  });

  socket.on('ord', function(ord) {
    if (!jeger) {
      socket.emit("feil", "Jeg vet ikke hvem du er.");
      return false;
    }
    var sjekkOrd = ord.toUpperCase();
    var type = ordbok[sjekkOrd];
    if (type) {
      socket.emit('ord', JSON.stringify({ finnes: sjekkOrd, type: type }));
    } else {
      socket.emit('ord', JSON.stringify({ finnes: null }));
    }
  });
/*
  router.get('/letters', function(req, res) {
    res.json({ letters: words.randomLetters(20) });
  });
*/

  socket.on('disconnect', function() {
    if (jeger) {
      console.log(jeger + " har forlatt oss.");
    } else {
      console.log('En bruker har forlatt oss.');
    }
  });
});


function readWordFile(fileName) {
  var wordCount = 0;
  lineReader.eachLine(fileName, function(line, last) {
//    console.log(line);
    var larr = line.split(' ');
    if (ordbok[larr[0]]) {
      ordbok[larr[0]] += '/'+larr[1];
    } else {
      ordbok[larr[0]] = larr[1];
      wordCount++;
    }
    if (last) {
      wordsRead = true;
      console.log("Added " + wordCount + " words to dictionary.");
    }
  });
}

readWordFile(wordFile);

