const canvas = document.getElementById('myCanvas');
const predictionCanvas = document.getElementById('predictionCanvas');
const predictButton = document.getElementById('predictButton');
const predictText = document.getElementById('prediction_text');

const context = canvas.getContext('2d');
const predictionContext = predictionCanvas.getContext('2d');
const canvasWidthHeight = 350;
const backgroundColor = '#0d0d0d';
const mouse = {
    x: undefined,
    y: undefined,
}

let model;
let modelLoaded = false;
document.addEventListener('DOMContentLoaded', async function() {
    modelLoaded = false;
    model = await tf.loadLayersModel('static/models/digits/model.json');
    modelLoaded = true;
    console.log('Model loaded');
});

var readyToDraw = false; 
var oldX = undefined;
var oldY = undefined;
var lineWidth = 20;
var firstN = 10;
var gridColor = '#3C3C3C';
var ticksValueColor = '#ffffff';
var highestBarColor = '#FF800E';
var defaultBarColor = '#007af4';
var backgroundColorArray;

canvas.width = canvasWidthHeight;
canvas.height = canvasWidthHeight;
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

predictButton.addEventListener('click', modelPrediction);

function modelPrediction() {
    if (!modelLoaded) return;

    let dataURL = canvas.toDataURL();
    let img = new Image();
    img.onload = function() {
        let loadedImage = img;
        let tensor = tf.browser.fromPixels(loadedImage, 1)
		.resizeNearestNeighbor([28, 28])
		.expandDims()
		.toFloat()
        .div(tf.scalar(255.0));

        model.predict(tensor).data().then(predictions => {
            let topNValues = getTopNValues(predictions, firstN);
            const classNameArray = topNValues.map(x => x.className);
            const probabilityArray = topNValues.map(x => x.probability);
            changeColorOfTheHighestBar(probabilityArray);

            barPlot(classNameArray, probabilityArray);
        });
    };
    img.src = dataURL;
}

function changeColorOfTheHighestBar(array) {
    backgroundColorArray = new Array(10).fill(defaultBarColor); 
    const index = array.indexOf(Math.max(...array));
    backgroundColorArray[index] = highestBarColor;
}

function barPlot(x, y) {
    predictionContext.canvas.width = 700;
    predictionContext.canvas.height = 350;

    const chartId = 'predictionCanvas';
    const existingChart = Chart.getChart(chartId);
    if (existingChart) {
        existingChart.destroy();
    }

    const myChart = new Chart(predictionContext, {
        type: 'bar',
        data: {
            labels: x,
            datasets: [{
                label: 'Probability',
                data: y,
                backgroundColor: backgroundColorArray,
                borderColor: 'white',
                borderWidth: 0
            }]
        },
        options: {
            legend: {
                display: false
            },
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                    top: 30,
                    bottom: 10
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: ticksValueColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                y: {
                    ticks: {
                        color: ticksValueColor
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
    myChart.canvas.id = chartId;
}  

function getTopNValues(predictions, n) {
    return Array.from(predictions).map(function(p, i) {
        return {
            probability: p,
            className: i
        };
    })
    // .sort(function(a, b) {
    //     return b.probability - a.probability;
    // })
    .slice(0, n);
}

function stop() {
    readyToDraw = false;
    context.closePath();
}

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
