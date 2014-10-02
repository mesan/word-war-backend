var lineReader = require('line-reader');
var words = require('./words');
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

var ordbok = {};
var wordFile = "NSF-ordlisten.txt";
var wordsRead = false;
var rundetid = 30000;
var sockets = [];
var brukerteller = 0;
var brukere = {};
var gjeldendeBokstaver = [];
var funnedeOrd = {};

app.use(express.static('./public'));

http.listen(3000, function() {
  console.log("Lytter til port 3000.");
});

io.on('connection', function(socket) {
  var jeger;

  sockets.push(socket);
  console.log('En bruker er med oss.');
  socket.emit('connected', "Velkommen til Word War!");

  // Logg inn med "jeg er"
  socket.on('jeg er', function(navn) {
    jeger = navn;
    console.log(jeger + " er med oss.");

    if (!brukere[jeger]) {
      brukerteller++;
      brukere[jeger] = { navn: jeger, poeng: 0, erMed: true, id: brukerteller }
    } else {
      brukere[jeger][erMed] = true;
    }
    io.emit("velkommen", JSON.stringify(brukere[jeger]));
  });

  socket.on('ord', function(ord) {
    if (!jeger) {
      socket.emit("feil", "Jeg vet ikke hvem du er.");
      return false;
    }

    sjekkOmOrdErMulig();
  });

  socket.on('disconnect', function() {
    if (jeger) {
      if (brukere[jeger]) {
        brukere[jeger][erMed] = false;
        io.emit("farvel", JSON.stringify(brukere[jeger]));
      }
      console.log(jeger + " har forlatt oss.");
    } else {
      console.log('En bruker har forlatt oss.');
    }
  });
});

function sjekkOmOrdErMulig() {
//  if ()
  var sjekkOrd = ord.toUpperCase();
  var type = ordbok[sjekkOrd];
  if (type) {
    io.emit('ordfunnet', type );
  }
}

function sendBokstaver() {
  gjeldendeBokstaver = words.randomLetters(30);
  var bokstaver = JSON.stringify({ bokstaver: gjeldendeBokstaver });
  console.log(bokstaver);
  io.emit("bokstaver", bokstaver);
  setTimeout(sendBokstaver, rundetid);
}

function klartTilSending() {
  wordsRead = true;
  sendBokstaver();
}

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
      console.log("Added " + wordCount + " words to dictionary.");
      klartTilSending();
    }
  });
}

readWordFile(wordFile);

