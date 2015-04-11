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
    var WID = 800, HEI =  550;

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

    cantools.fillStyle = "#333333";
    cantools.fillRect(20, 0, 20, 20);
    cantools.strokeRect(20, 0, 20, 20);

    cantools.fillStyle = "#777777";
    cantools.fillRect(40, 0, 20, 20);
    cantools.strokeRect(40, 0, 20, 20);

    cantools.fillStyle = "#CCCCCC";
    cantools.fillRect(60, 0, 20, 20);
    cantools.strokeRect(60, 0, 20, 20);

    cantools.fillStyle = "#FFFFFF";
    cantools.fillRect(80, 0, 20, 20);
    cantools.strokeRect(80, 0, 20, 20);

    // red
    cantools.fillStyle = "#280000";
    cantools.fillRect(0, 20, 20, 20);
    cantools.strokeRect(0, 20, 20, 20);

    cantools.fillStyle = "#500000";
    cantools.fillRect(20, 20, 20, 20);
    cantools.strokeRect(20, 20, 20, 20);

    cantools.fillStyle = "#800000";
    cantools.fillRect(40, 20, 20, 20);
    cantools.strokeRect(40, 20, 20, 20);

    cantools.fillStyle = "#A80000";
    cantools.fillRect(60, 20, 20, 20);
    cantools.strokeRect(60, 20, 20, 20);

    cantools.fillStyle = "#FF0000";
    cantools.fillRect(80, 20, 20, 20);
    cantools.strokeRect(80, 20, 20, 20);

    // green
    cantools.fillStyle = "#003300";
    cantools.fillRect(0, 40, 20, 20);
    cantools.strokeRect(0, 40, 20, 20);

    cantools.fillStyle = "#006600";
    cantools.fillRect(20, 40, 20, 20);
    cantools.strokeRect(20, 40, 20, 20);

    cantools.fillStyle = "#009900";
    cantools.fillRect(40, 40, 20, 20);
    cantools.strokeRect(40, 40, 20, 20);

    cantools.fillStyle = "#00CC00";
    cantools.fillRect(60, 40, 20, 20);
    cantools.strokeRect(60, 40, 20, 20);

    cantools.fillStyle = "#00FF00";
    cantools.fillRect(80, 40, 20, 20);
    cantools.strokeRect(80, 40, 20, 20);


    // blue
    cantools.fillStyle = "#000033";
    cantools.fillRect(0, 60, 20, 20);
    cantools.strokeRect(0, 60, 20, 20);

    cantools.fillStyle = "#000066";
    cantools.fillRect(20, 60, 20, 20);
    cantools.strokeRect(20, 60, 20, 20);

    cantools.fillStyle = "#000099";
    cantools.fillRect(40, 60, 20, 20);
    cantools.strokeRect(40, 60, 20, 20);

    cantools.fillStyle = "#0000CC";
    cantools.fillRect(60, 60, 20, 20);
    cantools.strokeRect(60, 60, 20, 20);

    cantools.fillStyle = "#0000FF";
    cantools.fillRect(80, 60, 20, 20);
    cantools.strokeRect(80, 60, 20, 20);

    var keymap = {16: false, 17: false, 187: false, 189: false};
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
            if(keymap[16] && keymap[187]) {
                BRUSHSZ+=5;
            }else if(keymap[16] && keymap[189]) {
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
        

        canvas.beginPath();
        canvas.moveTo(x, y);
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
        var p = cantools.getImageData(e.offsetX, e.offsetY, 1, 1).data;
        COLOR = "#" + ("000000" + ((p[0] << 16) | (p[1] << 8) | p[2]).toString(16)).slice(-6);
    });

    

    // What to do on receiving a message
    socket.on('message', function (data) {
        if(data.message) {
            if(!data.username)
                data.username = "Anon";
            if(data.username=='Server')
                $("#content").append("<li style='font-size:14px;'><i><b><span class='text-success'>Server</span></b>: " + data.message + "</i></li>");
            else
                $("#content").append("<li><b><span class='text-danger'>" + data.username + "</span></b>: " + data.message + "</li>");
            conversation.scrollTop = conversation.scrollHeight;
        }
        else {
            console.log("There is a problem (Empty message?):", data);
        }
    });
 
    // when another client draws
    socket.on('draw', function (data) {
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
