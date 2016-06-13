/**
 * Created by cuvit on 2016-03-22.
 */

//variable
var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    textHead = 'Human Computer Interface',
    textName = '2013726076 Park Jae Hoon',

    css01Radiobtn = document.getElementById('rad_css01'),
    css02Radiobtn = document.getElementById('rad_css02'),
    css03Radiobtn = document.getElementById('rad_css03'),

    angleSlider = document.getElementById('angleSlider'),
    angleOutput = document.getElementById('angleOutput'),
    angle = 30.0,
    MINIMUM_ANGLE = 0.0,
    MAXIMUM_ANGLE = 360.0;

css01Radiobtn.onchange = changeCss;
css02Radiobtn.onchange = changeCss;
css03Radiobtn.onchange = changeCss;

//function
function changeCss() {
    if(css02Radiobtn.checked == true) {
        document.getElementById('css01').href = './styleSheet_02.css';
    }
    else if(css03Radiobtn.checked == true)
        document.getElementById('css01').href = './styleSheet_03.css';
    else
        document.getElementById('css01').href = './styleSheet_Basic.css';
}

function drawGrid(context, color, stepx, stepy) {
    context.strokeStyle = color;
    context.lineWidth = 0.5;

    for (var i = stepx + 0.5; i < context.canvas.width; i += stepx) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, context.canvas.height);
        context.stroke();
    }

    for (var i = stepy + 0.5; i < context.canvas.height; i += stepy) {
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(context.canvas.width, i);
        context.stroke();
    }
}

function drawAngleText(value) {
    var text = parseFloat(value).toFixed(2);

    angleOutput.innerText = text;
}

// Event Handlers...............................................

angleSlider.onchange = function(e) {
    angle = e.target.value;

    if (angle < MINIMUM_ANGLE) angle = MINIMUM_ANGLE;
    else if (angle > MAXIMUM_ANGLE) angle = MAXIMUM_ANGLE;
    drawAngleText(angle);

    context.clearRect(0, 0, 600, 200);
    drawGrid(context, 'lightgray', 10, 10);

    context.strokeStyle = 'blue';
    context.fillStyle = 'red';
    context.lineWidth = '5';       // line width set to 5 for shapes
    context.beginPath();
    context.arc(150, 100, 60, 0, Math.PI / 180.0 * angle);
    context.stroke();

    context.beginPath();
    context.arc(300, 100, 60, 0, Math.PI / 180.0 * angle);
    context.fill();

    context.beginPath();
    context.arc(450, 100, 60, 0, Math.PI / 180.0 * angle);
    context.stroke();
    context.stroke();
    context.fill();
}

//initialize
drawGrid(context, 'lightgray', 10, 10);
changeCss();

drawAngleText(angle);

/*function flexibleCss() {
    var curWidth = document.body.clientWidth;
    if(curWidth <= 960) {
        alert("flexibleCss");
        var el = document.getElementsByClassName('header');
        el.style.width = '960px';
    }
}

flexibleCss();*/