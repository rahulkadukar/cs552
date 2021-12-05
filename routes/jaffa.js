var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser());

app.get('/form', function(req,res){
res.send('<form method="post" action="/">' +
           '<input type="hidden" name="_method" value="put" />' +
           'Your Name: <input type="text" name="username" />' +
           '<input type="submit" />' +
           '</form>');
//res.send('kalidas');

});

app.post('/', function(req, res) {
  var userName = req.body.username;
  var html = 'Hello ' +  userName + '<br>'
  res.send(html);
});

module.exports = app;
