function makePoint(x, y) {
    return { x: x, y: y };
}

function copyPoint(sourcePoint, targetPoint) {
    targetPoint.x = sourcePoint.x;
    targetPoint.y = sourcePoint.y;
}

function clonePoint(p) {
    return makePoint(p.x, p.y);
}

function pointsEqual(p1, p2) {
    return (p1.x == p2.x && p1.y == p2.y);
}

function rotateAroundPoint(curPoint, originPoint, angle) {
    var angleRad = degreeToRadian(angle);
    return {
        x: Math.cos(angleRad) * (curPoint.x - originPoint.x) - Math.sin(angleRad) * (curPoint.y - originPoint.y) + originPoint.x,
        y: Math.sin(angleRad) * (curPoint.x - originPoint.x) + Math.cos(angleRad) * (curPoint.y - originPoint.y) + originPoint.y
    };
}

function degreeToRadian(degree) {
    return degree * (Math.PI / 180);
}

function radianToDegree(radian) {
    return radian * (180 / Math.PI);
}

function distBetweenPoints(p1, p2) {
    var xDiff = p2.x - p1.x;
    var yDiff = p2.y - p1.y;
    return Math.abs(Math.sqrt((xDiff * xDiff) + (yDiff * yDiff)));
}

function getPointFromAngleSpeed(originPoint, angle, speed) {
    angle -= 90;
    var angleRad = degreeToRadian(angle);
    return makePoint(originPoint.x + (Math.cos(angleRad) * speed), originPoint.y + (Math.sin(angleRad) * speed));
}

function getAngleToPoint(p1, p2) {
    var o = p2.x - p1.x;
    var a = p1.y - p2.y;
    var at = radianToDegree(Math.atan(o / a));
    if (a < 0) {
        if (o < 0) at = 180 + Math.abs(at);
        else at = 180 - Math.abs(at);
    }
    if (at < 0) at = 360 + at;
    return at;
}

function getRandom(minVal, maxVal) {
    return Math.floor(Math.random() * (maxVal - minVal - 1)) + minVal;
}