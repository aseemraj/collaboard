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

// app.get("/video/", function(req, res){
//     res.render("video");
// });

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};

var socks = new Object();
var colors = new Object();

function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

function randomcolor() {
    var letters = '0123456789abcdef'.split('');
    var color = '#';
    for(var i=0;i<6;i++)color+=letters[Math.floor(Math.random()*12)];
    return color;
}

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
    socket.emit('idreport', { sockid: socket.id });
    socket.emit('message', { username: 'Server', message: 'Welcome to Collaboard!' });
    
    socket.on('joinserver', function(data) {
        socks[socket.id] = escapeHtml(data.username);
        colors[socket.id] = randomcolor();
        socket.broadcast.emit("message", { username: 'Server', message: '<b>' + escapeHtml(data.username) + '</b> appeared online!', color: colors[socket.id] });
        socket.broadcast.emit("joining", { username: escapeHtml(data.username), color: colors[socket.id], sock: socket.id });
        var userlist = [];
        var keys = Object.keys(socks);
        if(keys.length>1){
            for(var i=0;i<keys.length;i++){
                if(keys[i]==socket.id)continue;
                user = {name: socks[keys[i]], color: colors[keys[i]], sock: keys[i]};
                userlist[userlist.length] = user;
            }
        }
        socket.emit('newcommer', { users: userlist });
    });
    
    socket.on('send', function (data) {
        socket.broadcast.emit('message', { message: escapeHtml(data.message), username: escapeHtml(data.username), color: colors[socket.id] });
        socket.emit('message', { message: escapeHtml(data.message), username: 'Me', color: colors[socket.id] });
    });
    
    socket.on('namechange', function (data) {
        socks[socket.id] = escapeHtml(data.newname);
        socket.broadcast.emit('message', { username: 'Server', message: '<b>'+data.oldname+'</b> changed their name to <b>'+data.newname+'</b>', color: colors[socket.id] });
        socket.broadcast.emit('namechanged', { username: data.newname, sock: socket.id, color: colors[socket.id] });
    });
    
    socket.on('drawn', function (data) {
        io.sockets.emit('draw', data);
    });
    
    socket.on("disconnect", function (data) {
        var name = socks[socket.id];
        delete socks[socket.id];
        io.sockets.emit("message", { username: 'Server', message: '<b>' + name + '</b> went offline!', color: colors[socket.id] });
        io.sockets.emit("leaving", { sock: socket.id });
    });
});

console.log("Server is listening on port " + port);
