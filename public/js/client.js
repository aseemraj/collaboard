window.onload = function()
{
    // data for socket.io
    var ipaddr = 'localhost';
    var port = '8000';
    var messages = [];
    var socket = io.connect(ipaddr+':'+port);

    var name;
    if(localStorage.getItem("username"))
        name = localStorage.getItem("username");
    else {
        name = prompt("Enter your name", "New").toLowerCase();
        name = name.charAt(0).toUpperCase() + name.slice(1);
        localStorage.setItem("username", name);
    }
    socket.emit("joinserver", { username: name });

    var state = 0;  // to draw or not
    var BRUSHSZ = 2;
    var COLOR = "#000000";
    var canvas = $('#canvas').get(0).getContext("2d");
    var cantools = $('#tools').get(0).getContext('2d');
    var x = 0, y = 0;   // Mouse coordinates
    var WID = 750, HEI =  550;

    // display initial brush size
    $('#brushsz').innerHTML = 'BRUSHSZ';

    // init empty canvas
    canvas.fillStyle = "#FFFFFF"
    canvas.fillRect(0, 0, WID, HEI);

    // init drawing tools
    cantools.fillStyle = "#FFFFFF";
    cantools.strokeStyle = "#000000";
    cantools.fillRect(0, 0, 100, HEI);

    // black
    cantools.fillStyle = "#000000";
    cantools.fillRect(0, 0, 20, 20);
    cantools.strokeRect(0, 0, 20, 20);

    cantools.fillStyle = "#222222";
    cantools.fillRect(20, 0, 20, 20);
    cantools.strokeRect(20, 0, 20, 20);

    cantools.fillStyle = "#444444";
    cantools.fillRect(40, 0, 20, 20);
    cantools.strokeRect(40, 0, 20, 20);

    cantools.fillStyle = "#666666";
    cantools.fillRect(60, 0, 20, 20);
    cantools.strokeRect(60, 0, 20, 20);

    cantools.fillStyle = "#888888";
    cantools.fillRect(80, 0, 20, 20);
    cantools.strokeRect(80, 0, 20, 20);

    cantools.fillStyle = "#AAAAAA";
    cantools.fillRect(100, 0, 20, 20);
    cantools.strokeRect(100, 0, 20, 20);

    cantools.fillStyle = "#CCCCCC";
    cantools.fillRect(120, 0, 20, 20);
    cantools.strokeRect(120, 0, 20, 20);

    cantools.fillStyle = "#FFFFFF";
    cantools.fillRect(140, 0, 20, 20);
    cantools.strokeRect(140, 0, 20, 20);

    // red
    cantools.fillStyle = "#220000";
    cantools.fillRect(0, 20, 20, 20);
    cantools.strokeRect(0, 20, 20, 20);

    cantools.fillStyle = "#440000";
    cantools.fillRect(20, 20, 20, 20);
    cantools.strokeRect(20, 20, 20, 20);

    cantools.fillStyle = "#660000";
    cantools.fillRect(40, 20, 20, 20);
    cantools.strokeRect(40, 20, 20, 20);

    cantools.fillStyle = "#880000";
    cantools.fillRect(60, 20, 20, 20);
    cantools.strokeRect(60, 20, 20, 20);

    cantools.fillStyle = "#AF0000";
    cantools.fillRect(80, 20, 20, 20);
    cantools.strokeRect(80, 20, 20, 20);

    cantools.fillStyle = "#C00000";
    cantools.fillRect(100, 20, 20, 20);
    cantools.strokeRect(100, 20, 20, 20);

    cantools.fillStyle = "#DF0000";
    cantools.fillRect(120, 20, 20, 20);
    cantools.strokeRect(120, 20, 20, 20);

    cantools.fillStyle = "#FF0000";
    cantools.fillRect(140, 20, 20, 20);
    cantools.strokeRect(140, 20, 20, 20);

    // green
    cantools.fillStyle = "#001100";
    cantools.fillRect(0, 40, 20, 20);
    cantools.strokeRect(0, 40, 20, 20);

    cantools.fillStyle = "#002200";
    cantools.fillRect(20, 40, 20, 20);
    cantools.strokeRect(20, 40, 20, 20);

    cantools.fillStyle = "#004400";
    cantools.fillRect(40, 40, 20, 20);
    cantools.strokeRect(40, 40, 20, 20);

    cantools.fillStyle = "#006600";
    cantools.fillRect(60, 40, 20, 20);
    cantools.strokeRect(60, 40, 20, 20);

    cantools.fillStyle = "#008800";
    cantools.fillRect(80, 40, 20, 20);
    cantools.strokeRect(80, 40, 20, 20);

    cantools.fillStyle = "#00AA00";
    cantools.fillRect(100, 40, 20, 20);
    cantools.strokeRect(100, 40, 20, 20);

    cantools.fillStyle = "#00CC00";
    cantools.fillRect(120, 40, 20, 20);
    cantools.strokeRect(120, 40, 20, 20);

    cantools.fillStyle = "#00FF00";
    cantools.fillRect(140, 40, 20, 20);
    cantools.strokeRect(140, 40, 20, 20);


    // blue
    cantools.fillStyle = "#000011";
    cantools.fillRect(0, 60, 20, 20);
    cantools.strokeRect(0, 60, 20, 20);

    cantools.fillStyle = "#000022";
    cantools.fillRect(20, 60, 20, 20);
    cantools.strokeRect(20, 60, 20, 20);

    cantools.fillStyle = "#000044";
    cantools.fillRect(40, 60, 20, 20);
    cantools.strokeRect(40, 60, 20, 20);

    cantools.fillStyle = "#000066";
    cantools.fillRect(60, 60, 20, 20);
    cantools.strokeRect(60, 60, 20, 20);

    cantools.fillStyle = "#000088";
    cantools.fillRect(80, 60, 20, 20);
    cantools.strokeRect(80, 60, 20, 20);

    cantools.fillStyle = "#0000AA";
    cantools.fillRect(100, 60, 20, 20);
    cantools.strokeRect(100, 60, 20, 20);

    cantools.fillStyle = "#0000CC";
    cantools.fillRect(120, 60, 20, 20);
    cantools.strokeRect(120, 60, 20, 20);

    cantools.fillStyle = "#0000FF";
    cantools.fillRect(140, 60, 20, 20);
    cantools.strokeRect(140, 60, 20, 20);

    var keymap = {16: false, 17: false, 187: false, 189: false, 61: false, 173: false};
    // 16: shift
    // 17: ctrl
    // 187: =
    // 189: -

    // form data
    var field = document.getElementById("field");
    var sendButton = document.getElementById("sendbtn");
    var conversation = document.getElementById("conversation");

    // Detect keypresses for board shortcuts
    $(document).on("keydown", function (e) {
        if (e.keyCode in keymap) {
            keymap[e.keyCode] = true;
            if(keymap[16] && (keymap[187] || keymap[61])) {
                BRUSHSZ+=5;
            }else if(keymap[16] && (keymap[189] || keymap[173])) {
                BRUSHSZ-=5;
                if(BRUSHSZ<1)BRUSHSZ=1;
            }
        }
    }).on("keyup", function (e) {
        if (e.keyCode in keymap) {
            keymap[e.keyCode] = false;
        }
    });
    

    // Detect mouse events
    $('#canvas').on("mousedown", function (e) {
        state = 1;
        if(e.offsetX==undefined)
            x = e.pageX-$('#canvas').offset().left, y = e.pageY-$('#canvas').offset().top;
        else
            x = e.offsetX, y = e.offsetY;

        x-=5, y-=5;
        canvas.lineJoin = "round";
        canvas.beginPath();
        canvas.moveTo(x-1, y);
        canvas.lineTo(x, y);
        canvas.closePath();
        canvas.strokeStyle=COLOR;
        canvas.lineWidth = BRUSHSZ;
        canvas.stroke();
        var dataobj = {};
        dataobj.fx = x-1;
        dataobj.fy = y;
        dataobj.col = COLOR;
        dataobj.bsz = BRUSHSZ;
        dataobj.tx = x;
        dataobj.ty = y;
        socket.emit('drawn', dataobj);
    }).on("mouseup", function (e) {
        state = 0;
        if(e.offsetX==undefined)
            x = e.pageX-$('#canvas').offset().left, y = e.pageY-$('#canvas').offset().top;
        else
            x = e.offsetX, y = e.offsetY;
        canvas.closePath();
    }).on("mousemove", function (e) {
        // console.log(e);
        if(state==0)return;
        var dataobj = {};
        dataobj.fx = x;
        dataobj.fy = y;
        dataobj.col = COLOR;
        dataobj.bsz = BRUSHSZ;
        
        canvas.lineJoin = "round";
        canvas.beginPath();
        canvas.moveTo(x, y);
        if(e.offsetX==undefined)
            x = e.pageX-$('#canvas').offset().left, y = e.pageY-$('#canvas').offset().top;
        else
            x = e.offsetX, y = e.offsetY;
        x-=5, y-=5;
        canvas.lineTo(x, y);
        canvas.closePath();
        canvas.strokeStyle=COLOR;
        canvas.lineWidth = BRUSHSZ;
        canvas.stroke();
        
        dataobj.tx = x;
        dataobj.ty = y;
        
        socket.emit('drawn', dataobj);
    }).on("mouseleave", function (e) {
        state = 0;
    });

    // clear board event
    $('#clearbtn').on('click', function(e) {
        canvas.fillStyle = "#FFFFFF";
        canvas.fillRect(0, 0, WID, HEI);
    });

    // drawing tools operated
    $('#tools').on('click', function(e) {
        var a, b;
        if(e.offsetX==undefined)
            a = e.pageX-$('#tools').offset().left, b = e.pageY-$('#tools').offset().top;
        else
            a = e.offsetX, b = e.offsetY;
        var p = cantools.getImageData(a, b, 1, 1).data;
        COLOR = "#" + ("000000" + ((p[0] << 16) | (p[1] << 8) | p[2]).toString(16)).slice(-6);
    });

    

    // What to do on receiving a message
    socket.on('message', function (data) {
        if(data.message) {
            if(!data.username)
                data.username = "Anon";
            if(data.username=='Server')
                $("#content").append("<li style='background:#fff;color:#666;'><i><b><span style='color:#000'>Server :</span></b> " + data.message + "</i></li>");
            else
                $("#content").append("<li><b><span style=\"color:" + data.color + ";\">" + data.username + "</span></b>: " + data.message + "</li>");
            conversation.scrollTop = conversation.scrollHeight;
        }
        else {
            console.log("There is a problem (Empty message?):", data);
        }
    });
    
    // How to update the active users' list
    socket.on('newcommer', function (data) {
        var ulist = data.users;
        if(ulist.length == 0) {
            var elem = '<li id="none"><b>You are alone</b></li>';
            $('#activeusers').append(elem);
        }
        else {
            $('#none').remove();
            for(var i=0; i<ulist.length; i++) {
                var elem = '<li id="'+ulist[i].sock+'" style="color:'+ulist[i].color+'"><b>'+ulist[i].name+' </b><i class="fa fa-circle"></i></li>';
                $('#activeusers').append(elem);
            }
        }
    });
    socket.on('joining', function (data) {
        $('#none').remove();
        var elem = '<li id="'+data.sock+'" style="color:'+data.color+'"><b>'+data.username+' </b><i class="fa fa-circle"></i></li>';
        $('#activeusers').append(elem);
    });
    socket.on('leaving', function (data) {
        $('#'+data.sock).remove();
        if($('#activeusers li').length==0) {
            var elem = '<li id="none"><b>You are alone</b></li>';
            $('#activeusers').append(elem);
        }
    });
    socket.on('namechanged', function (data) {
        $('#'+data.sock).remove();
        var elem = '<li id="'+data.sock+'" style="color:'+data.color+'"><b>'+data.username+' </b><i class="fa fa-circle"></i></li>';
        $('#activeusers').append(elem);
    });
 
    // when another client draws
    socket.on('draw', function (data) {
        canvas.lineJoin = "round";
        canvas.beginPath();
        canvas.moveTo(data.fx, data.fy);
        canvas.lineTo(data.tx, data.ty);
        canvas.closePath();
        canvas.strokeStyle=data.col;
        canvas.lineWidth = data.bsz;
        canvas.stroke();
    });

    socket.on('idreport', function (data) {
        console.log("My socket ID is " + data.sockid);
    });
 
    // What to do when a message is to be sent
    sendButton.onclick = function() {
        var text = field.value;
        field.value = "";
        socket.emit('send', { message: text, username: name });
    };

    $('#chu').on('click', function() {
        name = prompt("Enter new name");
        name = name.charAt(0).toUpperCase() + name.slice(1);
        socket.emit('namechange', { oldname: localStorage.getItem("username"), newname: name });
        localStorage.setItem("username", name);
    });
    
    $('#customcolor').on('click', function() {
        var inp = prompt('Enter custom color hex code.');
        if(!inp)return;
        if(/^#?[a-fA-F0-9]{6}$/.test(inp))
            COLOR = inp;
        return;
    });
}
