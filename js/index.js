
var c   = document.getElementById("canvas");
var ctx = c.getContext("2d");
var o   = createOffscreenCanvas();
var teta = 0;
var attractTarget;
var targetRestore = false;

createText(o);
var particles = getPixels (o);
//setPixels(particles,c);
moveAllParticlesTo(300,300,0);

c.addEventListener("click", setTarget, false);
c.addEventListener("dblclick", unsetTarget, false);
//c.addEventListener("mousedown", unsetTarget, false);
//c.addEventListener("mouseup", unsetTarget, false);
//c.addEventListener("mousemove", getCoordinates, false);

function drawPixel(e) {
  setPixelC(getCoordinates(e).x,getCoordinates(e).y, 3, ctx, 255,0,0,255);
}

function setTarget(e) {
  attractTarget = {
    x: Math.floor(getCoordinates(e).x),
    y: Math.floor(getCoordinates(e).y),
    z: 0
  };
  console.log(attractTarget.x, attractTarget.y);
  targetRestore = false;
}

function unsetTarget(e) {
  attractTarget = null;
  targetRestore = true;
}


function getCoordinates(e) {
  var rect = c.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  // console.log("x: " + x + " y: " + y);
  return ({'x':x,'y':y});
}


function createOffscreenCanvas() {
  var offScreenCanvas = document.createElement('canvas');
  offScreenCanvas.width = 400;
  offScreenCanvas.height = 80;
  return offScreenCanvas; //return canvas element
}

function createText(canvas) {
  var context = canvas.getContext("2d");
  context.font = "50px Arial";
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

function setPixels(pixels, context=ctx) {
  for (var i = 0; i < pixels.length; i++) {
    setPixel(pixels[i].x, pixels[i].y, 1 , context);
  }
}


function setPixelC(x, y, size=1, context=ctx, r, g, b, a) {
  context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (a / 255) + ')';
  context.fillRect( x, y, size, size );
}

function setPixel(x, y, size=1, context=ctx) {
  context.fillRect(x, y, size, size);
}

function moveAllParticlesTo(x,y,z) {
  for (var i = 0; i < particles.length; i++) {
    particles[i].moveTo(x,y,z);
  }
}

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||  window.webkitRequestAnimationFrame ||  window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

var render = function() {
  if (teta++ > 360) {teta = 1}
  for (var i = 0; i < particles.length; i++) {
    //particles[i].wave(teta+i/30);
    if (attractTarget) {
      //particles[i].attract(attractTarget.x,attractTarget.y,attractTarget.z);
      particles[i].integrate(attractTarget.x,attractTarget.y,attractTarget.z);
    } else if (targetRestore) {
      particles[i].restore();
    }
  }
  ctx.clearRect(0, 0, c.width, c.height);
  setPixels(particles,ctx);
};

(function animloop() {
  requestAnimFrame(animloop);
  render();
})();
