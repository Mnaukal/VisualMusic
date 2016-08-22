// Simple gradient
define(['analyser', 'util'], function (analyser, util) {

var cover = 'e-spectrumGradient.jpg',
    canvas = util.getById('visual-canvas'),
    ctx = canvas.getContext('2d'),
    data,
    initOrNot = false,
    hue = 0,
    sat = 1,
    regress = 0.05,
    rotateHue = 0.0002,
    colorsCount = 32,
    colorsOutput = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    max = 256;

function draw() {
    ctx.save();
    data = analyser.getData();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "15px Arial";
    
    hue = (hue + rotateHue) % 1.0;
    var grd = ctx.createLinearGradient(0, 0, canvas.width, 0);
    for (var i = 0; i < colorsCount; i++)
    {
        var output = data[i * (256 / colorsCount)] / max;
        
        if(output > colorsOutput[i])
            colorsOutput[i] = output;
        else
            colorsOutput[i] -= regress;
        
        var rgb = HSVtoRGB((hue + i * (1 / colorsCount)) % 1.0, sat, colorsOutput[i]);
        
        grd.addColorStop((i + 0.5) * (1 / colorsCount), "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")");
    }
    
    ctx.fillStyle = grd;
    ctx.fillRect(0,0, canvas.width, canvas.height);

    //ctx.fillStyle = "#000";
    //ctx.fillText(colorsOutput, 10, 10);
    
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
    max = 256;
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