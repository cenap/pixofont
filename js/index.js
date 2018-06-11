
var c   = document.getElementById("canvas");
var ctx = c.getContext("2d");
var o   = createOffscreenCanvas();
var teta = 0;

createText(o);
var particles = getPixels (o);
setPixels(particles,c);

function createOffscreenCanvas() {
  var offScreenCanvas = document.createElement('canvas');
  offScreenCanvas.width = '1024';
  offScreenCanvas.height = '50';
  return offScreenCanvas; //return canvas element
}

function createText(canvas) {
  var context = canvas.getContext("2d");
  context.font = "30px Arial";
  context.textAlign = "center";
  context.fillStyle = "#0000FF";
  context.fillText("PIXOFONT", canvas.width/2, canvas.height/2);
}

function getPixels(canvas) {
  var context = canvas.getContext("2d");
  var width   = canvas.width;
  var height  = canvas.height;
  var data    = context.getImageData(0, 0, width, height).data;
  var particles = [];
  var dataFound = false;
  var r,g,b,a,t,cx = 0, cy = 0;

  for (var i = 0; i < data.length; i+=4) {
      r = data[i  ]; // red
      g = data[i+1]; // green
      b = data[i+2]; // blue
      a = data[i+3]; // alpha
      t = r+g+b+a;

      if (!dataFound && t>0) {dataFound=true;}

      if (dataFound) {
        if (++cx>=width) {
          cx = 0;
          cy++;
        };

        if (t>0) {
          var particle = new Particle(cx,cy,0);
          particles.push (particle);
        }
      }
  }
  return particles;

}

function setPixels(pixels, canvas) {
  for (var i = 0; i < pixels.length; i++) {
    setPixel(pixels[i].x, pixels[i].y, 4 , ctx);
  }
}


function setPixelC(x, y, size=1, context, r, g, b, a) {
    context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (a / 255) + ')';
    context.fillRect( x, y, size, size );
}

function setPixel(x, y, size=1, context) {
  var offsetX=60;
  var offsetY=200;
    context.fillRect(offsetX + x * size * 1.5, offsetY +  y * size * 1.5 , size, size );
}




window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||  window.webkitRequestAnimationFrame ||  window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

var render = function() {
  if (teta++>=360) {teta = 0}
  for (var i = 0; i < particles.length; i++) {
    particles[i].wave(teta+i/20);
    particles[i].attract(0,0,0);
    //particles[i].integrate();
  }
  ctx.clearRect(0, 0, c.width, c.height);
  setPixels(particles,c);
};

(function animloop() {
  requestAnimFrame(animloop);
  render();
})();
