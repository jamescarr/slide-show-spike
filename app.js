
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

app.get('/remote', function(req, res){
  res.render('remote', {title:'The Remote'});
});

var bindings = {}
io.sockets.on('connection', function(socket){
  socket.on('deck-identify', function(slideData){
    bindings[slideData.id] = {slides:socket}
  });
  socket.on('remote-identify', function(slideData){
    bindings[slideData.id]['remote']=socket
    socket.on('next', function(){
      bindings[slideData.id]['slides'].emit('next');
    });
    socket.on('prev', function(){
      bindings[slideData.id]['slides'].emit('prev');
    });
  });
});


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
