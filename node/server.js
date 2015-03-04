var express = require("express");
var app = express();
var port = 3700;

app.set('views', __dirname + '/templates');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
    res.render("index");
});


var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'Welcome user!' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
    socket.on('drawn', function (data) {
        io.sockets.emit('draw', data);
    });
});

console.log("Server is listening on port " + port);