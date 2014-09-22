var Words = (function() {
  var letterCount = 20,
      timeoutSeconds = 300,
      letterPool = 'aaaaabbcdddeeeeeeeeeeeeffggghiiiiijkkklllllmmmnnnnnnnooooppqrrrrrrrsssssstttttttuuvvwxyzæøåå',
      letters = { // letters and their fequency in the Norwegian language
        a: 4.9,
        b: 1.6,
        c: 0.2,
        d: 2.8,
        e: 11.5,
        f: 1.7,
        g: 3.0,
        h: 1.0,
        i: 4.7,
        j: 0.9,
        k: 2.9,
        l: 4.6,
        m: 2.5,
        n: 5.6,
        o: 4.1,
        p: 1.2,
        q: 0.1,
        r: 6.3,
        s: 5.8,
        t: 6.5,
        u: 1.3,
        v: 1.9,
        w: 0.1,
        x: 0.1,
        y: 0.4,
        z: 0.1,
        'æ': 0.2,
        'ø': 0.7,
        'å': 2.0
      };
  
  function getRandomLetters() {
    var lc = letterCount;
    var randomLetters = [];
    var letterPoolLength = letterPool.size();
    for (;lc--;) {
      randomLetters.push( letterPool[letterPoolLength * Math.random()] );
    }
    return randomLetters;
  }

  return {
    getRandomLetters: getRandomLetters
  };
})();