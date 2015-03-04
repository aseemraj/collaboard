var threading;
var flag=0;
var score = 0;
var CANVAS_WIDTH = 600;
var CANVAS_HEIGHT = 400;

var canvasElement = $("#canvas");
var canvas = canvasElement.get(0).getContext("2d");
canvasElement.appendTo('#board');

draw_lines();

function draw_lines()
{    
    canvas.beginPath();
    canvas.moveTo(CANVAS_WIDTH/4,0);
    canvas.lineTo(CANVAS_WIDTH/4,CANVAS_HEIGHT);
    canvas.moveTo(2*CANVAS_WIDTH/4,0);
    canvas.lineTo(2*CANVAS_WIDTH/4,CANVAS_HEIGHT);
    canvas.moveTo(3*CANVAS_WIDTH/4,0);
    canvas.lineTo(3*CANVAS_WIDTH/4,CANVAS_HEIGHT);
    canvas.moveTo(4*CANVAS_WIDTH/4,0);
    canvas.lineTo(4*CANVAS_WIDTH/4,CANVAS_HEIGHT);
    canvas.moveTo(0,CANVAS_HEIGHT/3);
    canvas.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT/3);
    canvas.moveTo(0,2*CANVAS_HEIGHT/3);
    canvas.lineTo(CANVAS_WIDTH, 2*CANVAS_HEIGHT/3);
    canvas.moveTo(0,3*CANVAS_HEIGHT/3);
    canvas.lineTo(CANVAS_WIDTH, 3*CANVAS_HEIGHT/3);
    canvas.stroke();
}