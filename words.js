(function() {
  
  "use strict";

  var lineReader = require('line-reader');
  
  var currentLetters = [];
  var takenWords = {};
  var dictionary = {};
  var letterPool = 'aaaaabbcdddeeeeeeeeeeeeffggghiiiiijkkklllllmmmnnnnnnnooooppqrrrrrrrsssssstttttttuuvvwxyzæøåå',
      letters = { // letters and their fequency in the Norwegian language and points per letter
        'a': [4.9,  1],
        'b': [1.6,  3],
        'c': [0.2,  5],
        'd': [2.8,  2],
        'e': [11.5, 1],
        'f': [1.7,  3],
        'g': [3.0,  1],
        'h': [1.0,  3],
        'i': [4.7,  1],
        'j': [0.9,  3],
        'k': [2.9,  2],
        'l': [4.6,  1],
        'm': [2.5,  2],
        'n': [5.6,  1],
        'o': [4.1,  1],
        'p': [1.2,  3],
        'q': [0.1,  10],
        'r': [6.3,  1],
        's': [5.8,  1],
        't': [6.5,  1],
        'u': [1.3,  3],
        'v': [1.9,  3],
        'w': [0.1,  10],
        'x': [0.1,  10],
        'y': [0.4,  10],
        'z': [0.1,  10],
        'æ': [0.2,  5],
        'ø': [0.7,  3],
        'å': [2.0,  2]
      };
  
  function getRandomLetters(letterCount) {
    var randomLetters = [];
    var letterPoolLength = letterPool.length;
    for (;letterCount--;) {
      randomLetters.push( letterPool.substr(letterPoolLength * Math.random(),1) );
    }
    return randomLetters;
  }

  function getLetterScore(letter) {
    var l = letters[letter];
    //console.log(letter + " " + l);
    if (!l) { return 0; }
    return l[1];
  }

  function scoreWord(word, callbackSuccess, callbackFailure) {
    word = word.toLowerCase();
    var letters = word.split('').sort();

    var score = 0;
    var l = 0;
    var cl = 0;
    var lettersLength = letters.length;
    var currentLettersLength = currentLetters.length;
    while (l<lettersLength && cl<currentLettersLength) {
      console.log("? " + letters[l] + ' ' + currentLetters[cl]);
      if (letters[l] === currentLetters[cl]) {
        score += getLetterScore(letters[l]);
        console.log("^"+score);
        l++;
      }
      cl++;
    }
    console.log(score);
    if (l === lettersLength) {
      var type = dictionary[word.toUpperCase()];
      if (type && !takenWords[word]) {
        takenWords[word] = true;
        callbackSuccess(word, type, score);
        return;
      }
    }

    callbackFailure();
  }

  function readWordFile(fileName, callback) {
    var wordCount = 0;
    lineReader.eachLine(fileName, function(line, last) {
  //    console.log(line);
      var larr = line.split(' ');
      if (dictionary[larr[0]]) {
        dictionary[larr[0]] += '/'+larr[1];
      } else {
        dictionary[larr[0]] = larr[1];
        wordCount++;
      }
      if (last) {
        console.log("Added " + wordCount + " words to dictionary.");
        callback();
      }
    });
  }

  function changeLetters(letterCount) {
    var randomLetters = getRandomLetters(letterCount);
    takenWords = {};
    currentLetters = randomLetters.slice(0);
    currentLetters.sort();
    return randomLetters;
  }

  module.exports.readWordFile = readWordFile;
  module.exports.changeLetters = changeLetters;
  module.exports.currentLetters = function () { return currentLetters; };
  module.exports.scoreWord = scoreWord;
})();