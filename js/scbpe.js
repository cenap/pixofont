//Salih Cenap Baydar Particle Engine: SCBPE
var t = 0, counter = 0;
const DAMPING = 0.1;

function Particle(x, y, z=0, r=0, g=0, b=0, a=255) {
  this.x = this.oldx = this.ox = x;
  this.y = this.oldy = this.oy = y;
  this.z = this.oldy = this.oz = z;
  this.color = {"r":r,"g":g,"b":b,"a":a/255};
  this.rotation = Math.random() / 50;
  this.speed = 0.1 + Math.random();
  //this.phase = Math.floor(360 * Math.random());
  this.phase = 0;
}

Particle.prototype.moveTo = function(x,y,z) {
  this.x += x;
  this.y += y;
  this.z += z;

  this.ox = this.x;
  this.oy = this.y;
  this.oz = this.z;
};

Particle.prototype.moveTowards = function(x,y,z) {
  if (this.x!=x) {
    this.x = (x+this.x) / 2;
  }
  if (this.y!=y) {
    this.y = (y+this.y) / 2;
  }
  if (this.z!=z) {
    this.z = (z+this.z) / 2;
  }
};

Particle.prototype.integrate = function(x,y,z) {
  var velocityX = (x - this.x) * DAMPING * this.speed;
  var velocityY = (y - this.y) * DAMPING * this.speed;
  var velocityZ = (z - this.z) * DAMPING * this.speed;
  this.x += velocityX;
  this.y += velocityY;
  this.z += velocityZ;
};

Particle.prototype.attract = function(x, y, z) {
  var dx = x - this.x;
  var dy = y - this.y;
  var dz = z - this.z;
  //var distance = Math.sqrt(dx * dx + dy * dy);
  var distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
    this.x += dx / distance;
    this.y += dy / distance;
    this.z += dz / distance;
  }
  //console.log(x , this.x, Math.abs(dx));
};

Particle.prototype.restore = function() {
  var dx = this.ox - this.x;
  var dy = this.oy - this.y;
  var dz = this.oz - this.z;
  // var distance = Math.sqrt(dx * dx + dy * dy);
  var distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
    this.x += dx / distance;
    this.y += dy / distance;
    this.z += dz / distance;
  }
  //console.log(x , this.x, Math.abs(dx));
};

Particle.prototype.animate = function(t) {
};

Particle.prototype.wave = function(t) {
  this.x += cos(t)/10;
  this.y += sin(t)/10;
  //this.z = 200 - 50*cos(this.speed * this.x/10);
};
