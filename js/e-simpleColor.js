// Simple color
define(['analyser', 'util'], function (analyser, util) {

var cover = 'e-simpleColor.jpg',
    canvas = util.getById('visual-canvas'),
    ctx = canvas.getContext('2d'),
    data,
    initOrNot = false,
    output = 0,
    hue = 0,
    sat = 1,
    regress = 0.05,
    rotateHue = 0.0002,
    max = 150,
    reduceMax = 0.05;

function draw() {
    ctx.save();
    data = analyser.getData();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "15px Arial";
    
    var sum = 0;
    for (var i = 0; i < data.length; i++)
    {
        sum += data[i] * data[i];
    }
    var rms = Math.sqrt(sum / data.length);    
    if(rms > max)
        max = rms;    
    var normalized = (rms - max/2) / (max/2);
    max -= reduceMax;
    if(normalized > output)
        output = normalized;
    else
        output -= regress;
    
    hue = (hue + rotateHue) % 1.0;
    
    var rgb = HSVtoRGB(hue, sat, output);
    
    ctx.fillStyle = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
    ctx.fillRect(0,0, canvas.width, canvas.height);

    //ctx.fillStyle = "#000";
    //ctx.fillText(output, 10, 10);
    
    ctx.restore();
}

function init() {
    util.setBg(6);
    
    initOrNot = true;
}

function isInit() {
    return initOrNot;
}

function enable() {
    max = 150;
    util.showCanvas();
}

function disable() {
    util.hideCanvas();
}
    
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

return {
    draw: draw,
    init: init,
    isInit: isInit,
    cover: cover,
    enable: enable,
    disable: disable
}

});