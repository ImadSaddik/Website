const canvas = document.getElementById('myCanvas');
const predictButton = document.getElementById('predictButton');
const context = canvas.getContext('2d');
const predictText = document.getElementById('predictText');
const lineWidth = 10;
const backgroundColor = '#0d0d0d';
const canvasWidth = 1024;
const canvasHeight = 420;

const mouse = {
    x: undefined,
    y: undefined,
}

var readyToDraw = false; 
var oldX = undefined;
var oldY = undefined;

canvas.width = canvasWidth;
canvas.height = canvasHeight;
context.lineCap = 'round';
context.lineJoin = 'round';

document.addEventListener('keydown', function(event) {
    if (event.key === 'Backspace') {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
});

canvas.addEventListener('mousedown', function(event){
    readyToDraw = true;
    setMouseCoordinates(event);
    setStrokeStyle(event);
    oldX = mouse.x;
    oldY = mouse.y;
    draw();
})

canvas.addEventListener('mousemove', function(event){
    if (readyToDraw) {
        setMouseCoordinates(event);
        drawLine();
    }
})

canvas.addEventListener('mouseup', stop);
canvas.addEventListener('mouseout', stop);

canvas.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

function setMouseCoordinates(event) {
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;
}

function setStrokeStyle(event) {
    if (event.button === 0) {
        context.strokeStyle = 'white';
        context.lineWidth = lineWidth;
    } else if (event.button === 2) {
        context.strokeStyle = backgroundColor;
        context.lineWidth = lineWidth * 5;
    }
}

function drawLine() {
    draw();
    oldX = mouse.x;
    oldY = mouse.y;
}

function draw() {
    context.beginPath();
    context.moveTo(oldX, oldY);
    context.lineTo(mouse.x, mouse.y);
    context.stroke();
}

function stop() {
    readyToDraw = false;
    context.closePath();
}

predictButton.addEventListener('click', function() {
  const formData = new FormData();
  const image = canvas.toDataURL('image/jpeg');
  formData.append('image', image);

  fetch('/word_prediction', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    predictText.innerHTML = data.prediction;
  })
  .catch(error => console.error(error));
});
