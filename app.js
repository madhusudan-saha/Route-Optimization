var express = require('express');
var bodyParser = require('body-parser');
var app = new express();
app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/public'));

var graph = require('./public/graph.json');

app.get('/', function(req,res){
    res.sendfile('index.html');
});

app.get('/api/graph', function(req, res){
    res.send(graph);
});

app.listen(3000, function(){
	console.log("Server listening on 3000");
});
