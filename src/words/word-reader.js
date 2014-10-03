module.exports = function readWordFile(lineReader, fileName, onLinesRead) {
  var wordCount = 0;

  var dictionary = {};

  lineReader.eachLine(fileName, function (line, last) {
    var lineSplitted = line.split(' ');
    var word = lineSplitted[0];
    var wordClass = lineSplitted[1];

    if (dictionary[word]) {
      dictionary[word] += '/' + wordClass;
    } else {
      dictionary[word] = wordClass;
      wordCount++;
    }

    if (last) {
      onLinesRead(dictionary);
    }
  });
};