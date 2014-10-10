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

var wordService;
var currentLetters;
var dictionary = { 'ABBA': 'subst', 'SE': 'verb' };
var letters = { a: 1, b: 2 };

exports['verifyLetters'] = {
  setUp: function (done) {
    wordService = require('./word-service')(dictionary, letters);
    currentLetters = wordService.changeLetters(2);
    done();
  },

  'returns true if the letters are verified': function (test) {
    test.equal(true, wordService.verifyLetters(currentLetters.join('')));
    test.done();
  },

  'returns false if the letters are not available': function (test) {
    currentLetters.push('!');
    test.equal(false, wordService.verifyLetters(currentLetters.join('')));
    test.done();
  }
};

exports['valueWord'] = {
  setUp: function (done) {
    wordService = require('./word-service')(dictionary, letters);
    currentLetters = wordService.changeLetters(2);
    done();
  },

  'values the word': function (test) {
    test.equal(3, wordService.valueWord('ab'));
    test.done();
  },

  'values empty word to zero': function (test) {
    test.equal(0, wordService.valueWord());
    test.equal(0, wordService.valueWord(''));
    test.equal(0, wordService.valueWord(null));
    test.done();
  },

  'values non-existent character to zero': function (test) {
    test.equal(0, wordService.valueWord('c'));
    test.done();
  }
};

exports['validWord'] = {
  setUp: function (done) {
    wordService = require('./word-service')(dictionary, letters);
    done();
  },

  'returns the word class if the word exists in the dictionary': function (test) {
    test.equal('subst', wordService.validWord('abba'));
    test.done();
  },

  'returns undefined if the word does not exist in the dictionary': function (test) {
    test.equal(undefined, wordService.validWord('xyz'));
    test.done();
  }
};

exports['getLetterScore'] = {
  setUp: function (done) {
    wordService = require('./word-service')(dictionary, letters);
    done();
  },

  'returns the correct score for a letter': function (test) {
    test.equal(1, wordService.getLetterScore('a'));
    test.equal(2, wordService.getLetterScore('b'));
    test.done();
  },

  'returns zero if the letter does not exist': function (test) {
    test.equal(0, wordService.getLetterScore('!'));
    test.done();
  }
};

exports['getWordClass'] = {
  setUp: function (done) {
    wordService = require('./word-service')(dictionary, letters);
    done();
  },

  'returns a word\'s class': function (test) {
    test.equal('verb', wordService.getWordClass('SE'));
    test.equal('subst', wordService.getWordClass('ABBA'));
    test.done();
  },

  'returns undefined if the word does not exist': function (test) {
    test.equal(undefined, wordService.getWordClass('BLABLA'));
    test.done();
  }
};

exports['wordTaken'] = {
  setUp: function (done) {
    wordService = require('./word-service')(dictionary, letters);
    done();
  },

  'returns true if the word is taken': function (test) {
    wordService.takeWord('SE');
    test.equal(true, wordService.wordTaken('SE'));
    test.done();
  },

  'returns false if the word is available': function (test) {
    test.equal(false, wordService.wordTaken('ABBA'));
    test.done();
  }
};
