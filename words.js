(function() {
  "use strict";
  
  var timeoutSeconds = 300,
      letterPool = 'aaaaabbcdddeeeeeeeeeeeeffggghiiiiijkkklllllmmmnnnnnnnooooppqrrrrrrrsssssstttttttuuvvwxyzæøåå',
      letters = { // letters and their fequency in the Norwegian language and points per letter
        a: [4.9, 1],
        b: [1.6, 2],
        c: [0.2, 5],
        d: [2.8, 1],
        e: [11.5, 1],
        f: [1.7, 2],
        g: [3.0, 1],
        h: [1.0, 2],
        i: [4.7, 1],
        j: [0.9, 2],
        k: [2.9, 1],
        l: [4.6, 1],
        m: [2.5, 1],
        n: [5.6, 1],
        o: [4.1, 1],
        p: [1.2, 2],
        q: [0.1, 10],
        r: [6.3, 1],
        s: [5.8, 1],
        t: [6.5, 1],
        u: [1.3, 2],
        v: [1.9, 2],
        w: [0.1, 10],
        x: [0.1, 10],
        y: [0.4, 10],
        z: [0.1, 10],
        'æ': [0.2, 5],
        'ø': [0.7, 3],
        'å': [2.0, 1]
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

  module.exports.randomLetters = getRandomLetters;
  module.exports.letterScore = getLetterScore;
})();