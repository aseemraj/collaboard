var express = require("express");
var app = express();
var port = 8000;

app.set('views', __dirname + '/templates');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
    res.render("index");
});

app.get("/video/", function(req, res){
    res.render("video");
});

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};

var sockids = new Object();
var socknames = new Object();

function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
    socket.emit('idreport', { sockid: socket.id });
    socket.on('joinserver', function(data) {
        delete socknames[sockids[escapeHtml(data.username)]];
        sockids[escapeHtml(data.username)] = socket.id;
        socknames[socket.id] = escapeHtml(data.username);
        io.sockets.emit("message", { username: 'Server', message: escapeHtml(data.username) + ' just joined!' });
    });
    socket.on('send', function (data) {
        // io.sockets.emit('message', data);
        io.sockets.emit('message', { message: escapeHtml(data.message), username: escapeHtml(data.username) });
    });
    socket.on('namechange', function (data) {
        sockids[escapeHtml(data.newname)] = socket.id;
        socknames[socket.id] = escapeHtml(data.newname);
        delete sockids[escapeHtml(data.oldname)];
        io.sockets.emit('message', { username: 'Server', message: '<b>'+data.oldname+'</b> changed their name to <b>'+data.newname+'</b>' });
    });
    socket.on('drawn', function (data) {
        io.sockets.emit('draw', data);
    });
    socket.on("disconnect", function (data) {
        var name = socknames[socket.id];
        var sockid = socket.id;
        io.sockets.emit("message", { username: 'Server', message: name + ' went offline!' });
        delete sockids[name];
        delete socknames[sockid];
    });
});


console.log("Server is listening on port " + port);
