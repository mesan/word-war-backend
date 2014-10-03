'use strict';

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var words;
var currentLetters;
var letters = { a: 1, b: 2 };

exports['valueWord'] = {
  setUp: function(done) {
    words = require('./words')({ 'ABDISERE': 'verb' }, letters);
    currentLetters = words.changeLetters(3);
    done();
  },
  'values the word': function (test) {
    test.equal(3, words.valueWord('ab'));
    test.done();
  },
  'values empty word to zero': function (test) {
    test.equal(0, words.valueWord());
    test.equal(0, words.valueWord(''));
    test.equal(0, words.valueWord(null));
    test.done();
  },
  'values non-existent character to zero': function (test) {
    test.equal(0, words.valueWord('c'));
    test.done();
  }
};
