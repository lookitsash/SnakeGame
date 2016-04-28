var htmlCanvas = null;
var ctx = null;
var lastTime = (new Date()).getTime(), currentTime = 0, delta = 0;

/*
var myPoints = new Array();
myPoints.push({ x: 50, y: 50 });
myPoints.push({ x: 200, y: 200 });
myPoints.push({ x: 300, y: 100 });
*/

var mousePos = { x: window.innerWidth/2, y: window.innerHeight/2 };
var myPoints = new Array();//[50, 50, 100, 100, 150, 150, 200,200,250,250,300,300,350,350,400,400,450,450,500,500]; //minimum two points
var snakeSpeed = 100;

var snakeSegments = 100;
var segmentLength = 5;
var curPos = clonePoint(mousePos);
for (var i = 0; i < snakeSegments; i++)
{
    myPoints.push(curPos.x);
    myPoints.push(curPos.y);

    curPos = getPointFromAngleSpeed(curPos, getRandom(270,360), segmentLength);
}

var backgroundTexture = null;

var cameraPos = clonePoint(mousePos);

function gameLoop() {
    window.requestAnimationFrame(gameLoop);

    currentTime = (new Date()).getTime();
    delta = (currentTime - lastTime) / 1000;

    ctx.clearRect(0, 0, htmlCanvas.width, htmlCanvas.height);

    var cameraOffset = getCameraOffset();

    var bgCountX = Math.ceil(htmlCanvas.width / backgroundTexture.width);
    var bgCountY = Math.ceil(htmlCanvas.height / backgroundTexture.height);
    for (var y = 0; y < bgCountY; y++) {
        for (var x = 0; x < bgCountX; x++) {
            ctx.drawImage(backgroundTexture, (x * backgroundTexture.width) + cameraOffset.x, (y * backgroundTexture.height) + cameraOffset.y);
        }
    }

    var offsetMousePos = clonePoint(mousePos);
    offsetMousePos.x -= cameraOffset.x;
    offsetMousePos.y -= cameraOffset.y;

    var headPoint = makePoint(myPoints[0], myPoints[1]);
    var tailPoint = makePoint(myPoints[myPoints.length - 2], myPoints[myPoints.length - 1]);
    var priorToTalePoint = makePoint(myPoints[myPoints.length - 4], myPoints[myPoints.length - 3]);
    var angleToMouse = getAngleToPoint(headPoint, offsetMousePos);
    var newHeadPoint = getPointFromAngleSpeed(headPoint, angleToMouse, snakeSpeed * delta);
    var angleToPriorToTail = getAngleToPoint(tailPoint, priorToTalePoint);
    var newTailPoint = getPointFromAngleSpeed(tailPoint, angleToPriorToTail, snakeSpeed * delta);

    

    var headDist = distBetweenPoints(headPoint, offsetMousePos);
    if (headDist > 1) {
        cameraPos = newHeadPoint;
        myPoints[0] = newHeadPoint.x;
        myPoints[1] = newHeadPoint.y;
        myPoints[myPoints.length - 2] = newTailPoint.x;
        myPoints[myPoints.length - 1] = newTailPoint.y;

        var tailDist = distBetweenPoints(tailPoint, priorToTalePoint);
        if (tailDist <= 1) {
            myPoints.splice(myPoints.length - 2, 2);
            myPoints.splice(0, 0, newHeadPoint.y);
            myPoints.splice(0, 0, newHeadPoint.x);
        }
    }

    //ctx.strokeStyle = 'blue';
    ctx.lineWidth = '2';
    //context.strokeRect(0, 0, window.innerWidth, window.innerHeight);

    var tension = 1;

    //drawCurve(context, myPoints); //default tension=0.5
    //drawCurve(ctx, myPoints, tension);

    ctx.beginPath();
    //drawLines(ctx, myPoints);
    //cameraPos.x
    ctx.moveTo(myPoints[0] + cameraOffset.x, myPoints[1] + cameraOffset.y);

    var lineCount = (myPoints.length / 2) - 1;
    var curLine = 0;
    for (i = 2; i < myPoints.length - 1; i += 2) {
        curLine++;
        //var alpha = 1 - (curLine / lineCount);
        //console.log(alpha);
        ctx.strokeStyle = 'rgba(0, 0, 255)';
        //ctx.strokeStyle = 'rgba(' + getRandom(1, 255) + ', ' + getRandom(1, 255) + ', ' + getRandom(1, 255) + ',255)';
        //ctx.lineTo(myPoints[i], myPoints[i + 1]);
        ctx.lineTo(myPoints[i] + cameraOffset.x, myPoints[i + 1] + cameraOffset.y);
        ctx.stroke();
    }
    

    ctx.beginPath();
    ctx.arc(myPoints[0] + cameraOffset.x, myPoints[1] + cameraOffset.y, 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#003300';
    ctx.stroke();

    lastTime = currentTime;
}

function getCameraOffset() {
    var canvasWidth = ctx.canvas.width;
    var canvasHeight = ctx.canvas.height;
    var halfCanvasWidth = canvasWidth / 2;
    var halfCanvasHeight = canvasHeight / 2;
    return makePoint(halfCanvasWidth - cameraPos.x, halfCanvasHeight - cameraPos.y);
}

function drawCurve(ctx, ptsa, tension, isClosed, numOfSegments, showPoints) {

    ctx.beginPath();

    drawLines(ctx, getCurvePoints(ptsa, tension, isClosed, numOfSegments));

    if (showPoints) {
        ctx.beginPath();
        for (var i = 0; i < ptsa.length - 1; i += 2)
            ctx.rect(ptsa[i] - 2, ptsa[i + 1] - 2, 4, 4);
    }

    ctx.stroke();
}

function getCurvePoints(pts, tension, isClosed, numOfSegments) {

    // use input value if provided, or use a default value	 
    tension = (typeof tension != 'undefined') ? tension : 0.5;
    isClosed = isClosed ? isClosed : false;
    numOfSegments = numOfSegments ? numOfSegments : 16;

    var _pts = [], res = [],	// clone array
        x, y,			// our x,y coords
        t1x, t2x, t1y, t2y,	// tension vectors
        c1, c2, c3, c4,		// cardinal points
        st, t, i;		// steps based on num. of segments

    // clone array so we don't change the original
    //
    _pts = pts.slice(0);

    // The algorithm require a previous and next point to the actual point array.
    // Check if we will draw closed or open curve.
    // If closed, copy end points to beginning and first points to end
    // If open, duplicate first points to befinning, end points to end
    if (isClosed) {
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
        _pts.push(pts[0]);
        _pts.push(pts[1]);
    }
    else {
        _pts.unshift(pts[1]);	//copy 1. point and insert at beginning
        _pts.unshift(pts[0]);
        _pts.push(pts[pts.length - 2]);	//copy last point and append
        _pts.push(pts[pts.length - 1]);
    }

    // ok, lets start..

    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 pts + 1e point before and after
    for (i = 2; i < (_pts.length - 4) ; i += 2) {
        for (t = 0; t <= numOfSegments; t++) {

            // calc tension vectors
            t1x = (_pts[i + 2] - _pts[i - 2]) * tension;
            t2x = (_pts[i + 4] - _pts[i]) * tension;

            t1y = (_pts[i + 3] - _pts[i - 1]) * tension;
            t2y = (_pts[i + 5] - _pts[i + 1]) * tension;

            // calc step
            st = t / numOfSegments;

            // calc cardinals
            c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1;
            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
            c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st;
            c4 = Math.pow(st, 3) - Math.pow(st, 2);

            // calc x and y cords with common control vectors
            x = c1 * _pts[i] + c2 * _pts[i + 2] + c3 * t1x + c4 * t2x;
            y = c1 * _pts[i + 1] + c2 * _pts[i + 3] + c3 * t1y + c4 * t2y;

            //store points in array
            res.push(x);
            res.push(y);

        }
    }

    return res;
}

function drawLines(ctx, pts) {
    ctx.moveTo(pts[0], pts[1]);
    for (i = 2; i < pts.length - 1; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

$(document).ready(function () {
    (function () {

        // Obtain a reference to the canvas element
        // using its id.
        htmlCanvas = document.getElementById('mainCanvas');

        // Obtain a graphics context on the
        // canvas element for drawing.
        ctx = htmlCanvas.getContext('2d');

        $(htmlCanvas).bind('mousemove', function (evt) { mousePos = getMousePos(htmlCanvas, evt); });

        // Start listening to resize events and
        // draw canvas.
        initialize();

        function initialize() {
            // Register an event listener to
            // call the resizeCanvas() function each time 
            // the window is resized.
            window.addEventListener('resize', resizeCanvas, false);

            // Draw canvas border for the first time.
            resizeCanvas();
        }

        // Display custom canvas.
        // In this case it's a blue, 5 pixel border that 
        // resizes along with the browser window.					
        function redraw() {
            //gameLoop();
        }

        // Runs each time the DOM window resize event fires.
        // Resets the canvas dimensions to match window,
        // then draws the new borders accordingly.
        function resizeCanvas() {
            htmlCanvas.width = window.innerWidth;
            htmlCanvas.height = window.innerHeight;
            redraw();
        }

    })();

    backgroundTexture = new Image();
    backgroundTexture.onload = function () {
        gameLoop();
    };
    backgroundTexture.src = 'Resources/Images/stonetexture_128.jpg';
});