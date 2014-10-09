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
var dictionary = { 'ABBA': 'subst' };
var letters = { a: 1, b: 2 };

exports['verifyLetters'] = {
  setUp: function(done) {
    words = require('./word-service')(dictionary, letters);
    currentLetters = words.changeLetters(2);
    done();
  },
  'returns true if the letters are verified': function (test) {
    test.equal(true, words.verifyLetters(currentLetters.join('')));
    test.done();
  },
  'returns false if the letters are not available': function (test) {
    currentLetters.push('!');
    test.equal(false, words.verifyLetters(currentLetters.join('')));
    test.done();
  }
};

exports['valueWord'] = {
  setUp: function(done) {
    words = require('./word-service')(dictionary, letters);
    currentLetters = words.changeLetters(2);
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

exports['validWord'] =  {
  setUp: function (done) {
    words = require('./word-service')(dictionary, letters);
    done();
  },
  'returns true if the word exists in the dictionary': function (test) {
    test.equal('subst', words.validWord('abba'));
    test.done();
  },
  'returns false if the word does not exist in the dictionary': function (test) {
    test.equal(undefined, words.validWord('xyz'));
    test.done();
  }
};
