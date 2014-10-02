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
      brukere[jeger].erMed = true;
    }
    io.emit("velkommen", JSON.stringify(brukere[jeger]));
  });

  socket.on('ord', function(ord) {
    if (!jeger) {
      socket.emit("feil", "Jeg vet ikke hvem du er.");
      return false;
    }

    var poeng = kalkulerPoengFraOrd(ord);
    brukere[jeger].poeng += poeng;

    if (poeng > 0) {
      io.emit("poeng", JSON.stringify(brukere[jeger]));
    }
  });

  socket.on('disconnect', function() {
    if (jeger) {
      if (brukere[jeger]) {
        brukere[jeger].erMed = false;
        io.emit("farvel", JSON.stringify(brukere[jeger]));
      }
      console.log(jeger + " har forlatt oss.");
    } else {
      console.log('En bruker har forlatt oss.');
    }
  });
});

function sjekkOmOrdetPasserBokstavene(ord) {
  var bokstaver = ord.toLowerCase().split('').sort();

  var score = 0;
  var b = 0;
  var gb = 0;
  var bl = bokstaver.length;
  var gbl = gjeldendeBokstaver.length;
  while (b<bl && gb<gbl) {
    // console.log("lik? " + bokstaver[b] + ' ' + gjeldendeBokstaver[gb]);
    if (bokstaver[b] === gjeldendeBokstaver[gb]) {
      score += words.letterScore(bokstaver[b]);
      b++;
    }
    gb++;
  }
  //console.log(b);
  if (b === bl) {
    return score;
  }
  return 0;
}

function kalkulerPoengFraOrd(ord) {
  console.log("Sjekk "+ord);
  var poeng = sjekkOmOrdetPasserBokstavene(ord);
  
  var sjekkOrd = ord.toUpperCase();
  var type = ordbok[sjekkOrd];
  if (type) {
    io.emit('ordfunnet', type );
    return poeng;
  }
  return 0;
}

function sendBokstaver() {
  gjeldendeBokstaver = words.randomLetters(30);
  var bokstaver = JSON.stringify({ bokstaver: gjeldendeBokstaver });
  gjeldendeBokstaver.sort();
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

