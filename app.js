var express = require('express')
var bodyParser = require('body-parser');
var connect = require('connect');
var serveStatic = require('serve-static');
var lineReader = require('line-reader');

var words = {};

var wordFile = "NSF-ordlisten.txt";
var web_port = 8080;
var rest_port = 8081;

function initWebServer(port) {
  connect().use(serveStatic(__dirname)).listen(port);
  console.log("Web server on port "+web_port);
}

function initRESTService(port) {
  var app = express();

  // configure app to use bodyParser()
  // this will let us get the data from a POST
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  var router = express.Router();
  router.get('/', function(req, res) {
    res.json({ message: 'Funker!' }); 
  });
  router.get('/word/:word', function(req, res) {
    var tocheck = req.params.word.toUpperCase();
    var word = null;
    var type = words[tocheck];
    if (type) {
      word = tocheck;
    }
    res.json({ exists: word, checked:tocheck, type: type });
  });

  app.use('/api', router);
  app.listen(port);
  console.log("REST API on port "+rest_port);
}

function readWordFile(fileName) {
  var wordCount = 0;
  lineReader.eachLine(fileName, function(line, last) {
//    console.log(line);
    var larr = line.split(' ');
    words[larr[0]] = larr[1];
    wordCount++;
    if (last) {
      console.log("Added "+wordCount+" words to dictionary.");
    }
  });
}

readWordFile(wordFile);
initWebServer(web_port);
initRESTService(rest_port);