var express = require('express');
var bodyParser = require('body-parser')
var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

app.use('/app', express.static(__dirname + '/app'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.json())

app.use(require('./controllers'))

app.listen(3000);
console.log('Listening on port 3000...');
