'use strict';

function getContext() {
  return window.zyxplay.context;
}

function setContext(context) {
  window.zyxplay = window.zyxplay || {};
  window.zyxplay.context = context;
  return context;
}

function createPath(path) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  // svg.setAttribute('width', '256');
  // svg.setAttribute('height', '240');
  // svg.setAttribute('viewBox', '0 0 128 120');
  const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  svg.appendChild(pathEl);
  pathEl.setAttribute('d', path);
  pathEl.setAttribute('fill', 'none');
  pathEl.setAttribute('stroke', 'black');
  pathEl.setAttribute('stroke-width', '2');
  pathEl.setAttribute('id', 'path');

  return pathEl;
}

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function angleToTarget(source, target) {
  return Math.atan2(target.y - source.y, target.x - source.x);
}

function clamp(min, max, value) {
  return Math.min(Math.max(min, value), max);
}

function collides(obj1, obj2) {
  let rect1 = getRect(obj1);
  let rect2 = getRect(obj2);

  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function getRect(obj) {
  let { x = 0, y = 0, width, height } = obj;

  x -= width * .5;
  y -= height * .5;

  if (width < 0) {
    x += width;
    width *= -1;
  }
  if (height < 0) {
    y += height;
    height *= -1;
  }

  return {
    x,
    y,
    width,
    height
  };
}

function delay(callback, ms, ...args) {
  return setTimeout(callback, ms, ...args);
}

function rnd(min = 0, max = 1) {
  return (Math.random())*(max-min)+min;
}

/*
  (c) 2012-2021 Noora Halme et al. (see AUTHORS)

  This code is licensed under the MIT license:
  http://www.opensource.org/licenses/mit-license.php

  Various utility functions
*/

// helper functions for picking up signed, unsigned, little endian, etc from an unsigned 8-bit buffer
function le_word(buffer, offset) {
  return buffer[offset]|(buffer[offset+1]<<8);
}
function le_dword(buffer, offset) {
  return buffer[offset]|(buffer[offset+1]<<8)|(buffer[offset+2]<<16)|(buffer[offset+3]<<24);
}
function s_byte(buffer, offset) {
  return (buffer[offset]<128)?buffer[offset]:(buffer[offset]-256);
}
function s_le_word(buffer, offset) {
  return (le_word(buffer,offset)<32768)?le_word(buffer,offset):(le_word(buffer,offset)-65536);
}

// convert from MS-DOS extended ASCII to Unicode
function dos2utf(c) {
  if (c<128) return String.fromCharCode(c);
  var cs=[
    0x00c7, 0x00fc, 0x00e9, 0x00e2, 0x00e4, 0x00e0, 0x00e5, 0x00e7, 0x00ea, 0x00eb, 0x00e8, 0x00ef, 0x00ee, 0x00ec, 0x00c4, 0x00c5,
    0x00c9, 0x00e6, 0x00c6, 0x00f4, 0x00f6, 0x00f2, 0x00fb, 0x00f9, 0x00ff, 0x00d6, 0x00dc, 0x00f8, 0x00a3, 0x00d8, 0x00d7, 0x0192,
    0x00e1, 0x00ed, 0x00f3, 0x00fa, 0x00f1, 0x00d1, 0x00aa, 0x00ba, 0x00bf, 0x00ae, 0x00ac, 0x00bd, 0x00bc, 0x00a1, 0x00ab, 0x00bb,
    0x2591, 0x2592, 0x2593, 0x2502, 0x2524, 0x00c1, 0x00c2, 0x00c0, 0x00a9, 0x2563, 0x2551, 0x2557, 0x255d, 0x00a2, 0x00a5, 0x2510,
    0x2514, 0x2534, 0x252c, 0x251c, 0x2500, 0x253c, 0x00e3, 0x00c3, 0x255a, 0x2554, 0x2569, 0x2566, 0x2560, 0x2550, 0x256c, 0x00a4,
    0x00f0, 0x00d0, 0x00ca, 0x00cb, 0x00c8, 0x0131, 0x00cd, 0x00ce, 0x00cf, 0x2518, 0x250c, 0x2588, 0x2584, 0x00a6, 0x00cc, 0x2580,
    0x00d3, 0x00df, 0x00d4, 0x00d2, 0x00f5, 0x00d5, 0x00b5, 0x00fe, 0x00de, 0x00da, 0x00db, 0x00d9, 0x00fd, 0x00dd, 0x00af, 0x00b4,
    0x00ad, 0x00b1, 0x2017, 0x00be, 0x00b6, 0x00a7, 0x00f7, 0x00b8, 0x00b0, 0x00a8, 0x00b7, 0x00b9, 0x00b3, 0x00b2, 0x25a0, 0x00a0
  ];
  return String.fromCharCode(cs[c-128]);
}

function gameLoop({
  update,
  render,
}) {
  let fps = 60;
  let accumulator = 0;
  let delta = 1e3 / fps; // delta between performance.now timings (in ms)
  let step = 1 / fps;
  let last, now, dt, loop;
  const ctx = getContext();

  function frame() {
    requestAnimationFrame(frame);
    now = performance.now();
    dt = now - last;
    last = now;

    if (dt > 1e3) {
      return;
    }

    accumulator += dt;

    while (accumulator >= delta) {
      update(step);
      accumulator -= delta;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    render();
  }

  loop = {
    start() {
      last = performance.now();
      requestAnimationFrame(frame);
    }
  };

  return loop;
}

let callbacks = {};

function on(event, callback) {
  callbacks[event] = callbacks[event] || [];
  callbacks[event].push(callback);
}

function clearEvents(exceptions = []) {
  const callbacksTmp = Object.keys(callbacks).reduce((acc, key) => {
    if (exceptions.includes(key)) {
      acc[key] = callbacks[key];
    }
    return acc;
  }, {});
  callbacks = callbacksTmp;
}

function emit(event, ...args) {
  (callbacks[event] || []).map(fn => fn(...args));
}

let imageAssets = {};
let dataAssets = {};

function getUrl(url, base) {
  return new URL(url, base).href;
}

function addGlobal() {
  if (!window.__k) {
    window.__k = {
      u: getUrl,
      i: imageAssets,
      d: dataAssets,
    };
  }
}

function loadData(index, fnc, params) {
  addGlobal();

  if (dataAssets[index])
    return dataAssets[index];

  dataAssets[index] = fnc(...params);
}

function loadImage(url, img = null) {
  addGlobal();

  return new Promise((resolve, reject) => {
    let image, fullUrl;

    if (img) {
      imageAssets[url] = img;
      return resolve(img);
    }
  
    // resolvedUrl = joinPath(imagePath, url);
    if (imageAssets[url])
      return resolve(imageAssets[url]);

    image = new Image();

    image.onload = () => {
      fullUrl = getUrl(url, window.location.href);
      imageAssets[fullUrl] = imageAssets[url] = image;
      // emit('assetLoaded', this, url);
      resolve(image);
    };

    image.onerror = () => {
      reject(
      );
    };

    image.src = url;
  });
}

class GameObject {
  constructor(props) {
    this.init(props);
  }
  init(props = {}) {
    const properties = {
      name: '',
      x: 0,
      y: 0,
      width: 8,
      height: 8,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      anchor: { x: 0, y: 0 },
      color: 'white',
      dx: 0,
      dy: 0,
      ddx: 0,
      ddy: 0,
      ttl: Infinity,
      frame: 0,
      sprite: 0,
      context: getContext(),
      spritesheet: [imageAssets['spritesheet.png'], 8, 8],
      shield: 20,
      hitted: false,
      _uf: props.update,
      _rf: props.render,
      _df: props.draw,
      ...props,
    };

    Object.assign(this, properties);
  }
  hit(damage) {
    emit('hit');
    this.shield -= damage;
    this.hitted = true;
    this.shield <= 0 && (this.die && this.die());
    delay(() => this.hitted = false, 100);
  }
  advance() {
    this.x += this.dx;
    this.y += this.dy;
    this.dx += this.ddx;
    this.dy += this.ddy;
    this.ttl--;
    this.frame++;
  }
  update() {
    if (this._uf) {
      this._uf();
      return;
    }
    this.advance();
  }
  render() {
    if (this._rf) return this._rf();

    const { context: ctx, x, y, anchor, rotation, scaleX, scaleY, width, height } = this;

    ctx.save();
    ctx.translate(x, y);
    rotation && ctx.rotate(rotation);
    scaleX && scaleY && ctx.scale(scaleX, scaleY);
    ctx.translate(-width * anchor.x, -height * anchor.y);
    this.draw();
    ctx.restore();
  }
  draw() {
    if (this._df) return this._df();

    const { context: ctx, color, width, height } = this;

    if (this.hitted) {
      ctx.save();
      ctx.translate(0, -1);
    }
    if (this.color) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.drawImage(
        this.spritesheet[0],
        this.sprite * this.spritesheet[1], 0, width, height,
        0, 0, width, height
      );
    }

    if (this.hitted) {
      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
      ctx.restore();
    }
  }
  isAlive() {
    return this.ttl > 0;
  }
}

const gameObject = (props) => new GameObject(props);

class Scene {
  constructor(props) {
    this.init(props);
  }
  init(props = {}) {
    const filteredProps = Object.keys(props).reduce((acc, key) => {
      if (typeof props[key] !== 'function') {
        acc[key] = props[key];
      }
      return acc;
    }, {});

    const properties = {
      id: 'scene',
      context: getContext(),
      _uf: props.update,
      _rf: props.render,
      children: [],
      paused: false,
      ...filteredProps,
    };

    Object.assign(this, properties);
  }
  add(child) {
    this.children.push(child);
  }
  pause() {
    this.paused = true;
  }
  resume() {
    this.paused = false;
  }
  update(dt) {
    if (this.paused) return;
    this.children.forEach(child => {
      if (!child.isAlive) return child.update(dt);
      child.isAlive() && child.update(dt);
    });
    this._uf && this._uf();
  }
  render() {
    this.context.save();
    // @todo This is a big bug. It's calling the update function instead of the render function.
    // To fix it, all the frame related logic needs to be adjusted.
    this._uf && this._uf();
    // this._rf && this._rf();
    this.children.forEach(child => {
      if (!child.isAlive) return child.render();
      child.isAlive() && child.render();
    });
    this.context.restore();
  }
}

function scene(props) {
  return new Scene(props);
}

class Text extends GameObject {
  constructor(props = {}) {
    const properties = {
      name: 'text',
      x: 0,
      y: 0,
      text: '',
      color: 'white',
      align: 'left',
      lineHeight: 8,
      scale: 1,
      spritesheet: imageAssets['font.png'],
      ...props,
    };
    const fontName = properties.color ? `font-${properties.color}.png` : 'font.png';
    properties.spritesheet = imageAssets[fontName];
    super(properties);
  }
  draw() {
    const charWidth = 8;
    const charHeight = 8;
    const texts = this.text.split('\n');
    const { context, align, lineHeight, color } = this;

    context.save();
    texts.forEach(t => {
      context.save();

      if (align === 'center') {
        context.translate(-t.length * charWidth / 2, 0);
      }
      if (align === 'right') {
        context.translate(-t.length * charWidth, 0);
      }

      for (let i = 0; i < t.length; i++) {
        const char = t.charCodeAt(i);
        let index = 0;
        char >= 65 && char <= 90 ? index = char - 65 : null;
        char >= 48 && char <= 57 ? index = char - 22 : null;
        char === 32 && (index = -1);
        char === 46 && (index = 36);
        char === 44 && (index = 37);
        char === 63 && (index = 38);
        char === 33 && (index = 39);
        char === 58 && (index = 40);
        char === 64 && (index = 41);

        if (index === -1) {
          continue;
        }

        const 
          sx = index * (charWidth + 1),
          sy = 0,
          sw = charWidth + 1,
          sh = charHeight + 1,
          dx = i * charWidth,
          dy = 0,
          dw = charWidth + 1,
          dh = charHeight + 1;

        context.drawImage(this.spritesheet, sx, sy, sw, sh, dx, dy, dw, dh);
      }

      context.restore();
      context.translate(0, lineHeight);
    });
    context.restore();
  }
}

function text (props) { return new Text(props)}

class ExplosionParticle extends GameObject {
  constructor(props) {
    const properties = {
      name: 'explosion-particle',
      color: 'white',
      anchor: { x: .5, y: .5 },
      ...props,
    };
    super(properties);
  }
  update() {
    !this.color && this.ttl < 30 && (this.scaleX = this.scaleY = this.ttl / 30);
    this.color && this.ttl < 60 && (this.scaleX = this.scaleY = this.ttl / 60);
    this.advance();
  }
  draw() {
    !this.color && this.context.drawImage(
      this.spritesheet[0],
      120, 0, 8, 8,
      0, 0, 8, 8
    );

    this.color && (
      this.context.fillStyle = this.color,
      this.context.fillRect(0, 0, 2, 2)
    );
  }
}

function explosionParticle(props) {
  return new ExplosionParticle(props);
}

let keydownCallbacks = {};
let keyupCallbacks = {};
let pressedKeys = {};

let keyMap = {
  // named keys
  'Enter': 'enter',
  'Escape': 'esc',
  'Space': 'space',
  'ArrowLeft': 'arrowleft',
  'ArrowUp': 'arrowup',
  'ArrowRight': 'arrowright',
  'ArrowDown': 'arrowdown'
};

function call(callback = () => {}, evt) {
  if (callback._pd) {
    evt.preventDefault();
  }
  callback(evt);
}

function keydownEventHandler(evt) {
  let key = keyMap[evt.code];
  let callback = keydownCallbacks[key];
  pressedKeys[key] = true;
  call(callback, evt);
}

function keyupEventHandler(evt) {
  let key = keyMap[evt.code];
  let callback = keyupCallbacks[key];
  pressedKeys[key] = false;
  call(callback, evt);
}

function initKeys() {
  let i;

  // alpha keys
  // @see https://stackoverflow.com/a/43095772/2124254
  for (i = 0; i < 26; i++) {
    // rollupjs considers this a side-effect (for now), so we'll do it
    // in the initKeys function
    keyMap['Key' + String.fromCharCode(i + 65)] = String.fromCharCode(
      i + 97
    );
  }

  // numeric keys
  for (i = 0; i < 10; i++) {
    keyMap['Digit' + i] = keyMap['Numpad' + i] = '' + i;
  }

  window.addEventListener('keydown', keydownEventHandler);
  window.addEventListener('keyup', keyupEventHandler);
  // window.addEventListener('blur', blurEventHandler);
}

function keyPressed(keys) {
  return !![].concat(keys).some(key => pressedKeys[key]);
}

function onKey(
  keys,
  callback,
  { handler = 'keydown', preventDefault = true } = {}
) {
  let callbacks =
    handler == 'keydown' ? keydownCallbacks : keyupCallbacks;
  // pd = preventDefault
  callback._pd = preventDefault;
  // smaller than doing `Array.isArray(keys) ? keys : [keys]`
  [].concat(keys).map(key => (callbacks[key] = callback));
}

function offKey(keys, { handler = 'keydown' } = {}) {
  let callbacks =
    handler == 'keydown' ? keydownCallbacks : keyupCallbacks;
  [].concat(keys).map(key => delete callbacks[key]);
}

// zzfx() - the universal entry point -- returns a AudioBufferSourceNode

// zzfxP() - the sound player -- returns a AudioBufferSourceNode
const zzfxP=(...t)=>{let e=zzfxX.createBufferSource(),f=zzfxX.createBuffer(t.length,t[0].length,zzfxR);t.map((d,i)=>f.getChannelData(i).set(d)),e.buffer=f,e.connect(zzfxX.destination),e.start();return e};

// zzfxG() - the sound generator -- returns an array of sample data
const zzfxG=(q=1,k=.05,c=220,e=0,t=0,u=.1,r=0,F=1,v=0,z=0,w=0,A=0,l=0,B=0,x=0,G=0,d=0,y=1,m=0,C=0)=>{let b=2*Math.PI,H=v*=500*b/zzfxR**2,I=(0<x?1:-1)*b/4,D=c*=(1+2*k*Math.random()-k)*b/zzfxR,Z=[],g=0,E=0,a=0,n=1,J=0,K=0,f=0,p,h;e=99+zzfxR*e;m*=zzfxR;t*=zzfxR;u*=zzfxR;d*=zzfxR;z*=500*b/zzfxR**3;x*=b/zzfxR;w*=b/zzfxR;A*=zzfxR;l=zzfxR*l|0;for(h=e+m+t+u+d|0;a<h;Z[a++]=f)++K%(100*G|0)||(f=r?1<r?2<r?3<r?Math.sin((g%b)**3):Math.max(Math.min(Math.tan(g),1),-1):1-(2*g/b%2+2)%2:1-4*Math.abs(Math.round(g/b)-g/b):Math.sin(g),f=(l?1-C+C*Math.sin(2*Math.PI*a/l):1)*(0<f?1:-1)*Math.abs(f)**F*q*zzfxV*(a<e?a/e:a<e+m?1-(a-e)/m*(1-y):a<e+m+t?y:a<h-d?(h-a-d)/u*y:0),f=d?f/2+(d>a?0:(a<h-d?1:(h-a)/d)*Z[a-d|0]/2):f),p=(c+=v+=z)*Math.sin(E*x-I),g+=p-p*B*(1-1E9*(Math.sin(a)+1)%2),E+=p-p*B*(1-1E9*(Math.sin(a)**2+1)%2),n&&++n>A&&(c+=w,D+=w,n=0),!l||++J%l||(c=D,v=H,n=n||1);return Z};

// zzfxV - global volume
const zzfxV=.3;

// zzfxR - global sample rate
const zzfxR=44100;

// zzfxX - the common audio context
const zzfxX=new(window.AudioContext||webkitAudioContext);

const cw = 256;
const ch = 240;

class Ship extends GameObject {
  init(props) {
    const properties = {
      name: 'ship',
      spawning: true,
      y: 248,
      spritesheet: [imageAssets['spritesheet16.png'], 16, 16],
      width: 16,
      height: 16,
      imune: false,
      dying: false,
      shield: 100,
      lives: 3,
      score: 0,
      fireLevel: 0,
      firing: false,
      fireTimeout: null,
      anchor: { x: .5, y: .5 },
      sprite: 1,
      ...props,
    };
    super.init(properties);
    this.spawn();
  }
  powerUp(powerup) {
    zzfxP(dataAssets['powerup']);
    if (powerup.type === 'shield') {
      this.shield += 100;
      this.shield > 100 && (this.shield = 100);
    }

    const previousType = this.fireType;

    if (powerup.type === 'fire' || powerup.type === 'laser') {
      this.fireType = powerup.type === 'fire' ? 0 : 1;
      this.fireType !== previousType && (this.fireLevel = 0);
      this.fireLevel++;
      this.fireLevel > 4 && (this.fireLevel = 4);
      if (this.fireLevel === 4) {
        clearTimeout(this.fireTimeout);
        emit('start-fire-timer');
        this.fireTimeout = delay(() => {
          emit('end-fire-timer');
          this.fireLevel === 4 && (this.fireLevel = 3);
        }, 30000);
      }
    }
  }
  fire() {
    if (this.firing) return;
    this.firing = true;
    emit('ship-fire', this.x - 1, this.y - 8, rnd(-.3, .3));

    if (this.fireLevel > 0) {
      emit('ship-fire', this.x - 1, this.y - 8, rnd(-.5, .5));
    }

    if (this.fireLevel > 1) {
      delay(() => {
        emit('ship-fire', this.x - 1, this.y - 8, rnd(-.3, .3));
        emit('ship-fire', this.x - 1, this.y - 8, rnd(-.5, .5));
      }, 100);
    }

    if (this.fireLevel > 2) {
      delay(() => {
        emit('ship-fire', this.x - 1, this.y - 8, -2);
        emit('ship-fire', this.x - 1, this.y - 8, 2);
      }, 400);
    }

    if (this.fireLevel > 3) {
      delay(() => {
        emit('ship-fire', this.x - 16, this.y - 4, rnd(-.1, .1));
        emit('ship-fire', this.x + 14, this.y - 4, rnd(-.1, .1));
      }, 200);
    }

    delay(() => {
      this.firing = false;
    }, 200);
  }
  fire2() {
    if (this.firing) return;
    this.firing = true;
    let repeat = 200;
    emit('ship-fire-laser', this.x - 1, this.y - 16, 0);

    if (this.fireLevel > 0) {
      delay(() => {
        emit('ship-fire-laser', this.x - 6, this.y - 10, 0);
      }, 20);
      delay(() => {
        emit('ship-fire-laser', this.x + 5, this.y - 10, 0);
      }, 40);
    }

    if (this.fireLevel > 1) {
      repeat = 150;
    }

    if (this.fireLevel > 2) {
      repeat = 100;
    }

    if (this.fireLevel > 3) {
      delay(() => {
        emit('ship-fire-laser', this.x - 16, this.y - 16, 0);
      }, 60);
      delay(() => {
        emit('ship-fire-laser', this.x + 14, this.y - 16, 0);
      }, 80);
    }

    delay(() => {
      this.firing = false;
    }, repeat);
  }
  die() {
    emit('ship-die');
    emit('explosion', this.x, this.y - 4, 60, 4, 'white', true);
    this.dying = true;
    this.ttl = 0;
    this.lives--;
    this.imune = true;
    this.dx = 0;
    this.ddx = 0;
    this.x = 128;
    delay(() => {
      this.spawn();
    }, 1000);
  }
  spawn() {
    this.imune = true;
    this.spawning = true;
    this.ttl = Infinity;
    this.y = ch + 32;
    this.frame = 0;
    this.shield = 100;
    this.fireLevel = 0;
    this.fireType = 0;
    delay(() => {
      this.spawning = false;
      this.imune = false;
    }, 1000);
  }
  update() {
    const friction = .91;

    this.ddx = 0;
    this.ddy = 0;

    this.dx *= friction;
    this.dy *= friction;

    this.sprite = 2;

    keyPressed(['d', 'arrowright']) && this.dx < 2 && (this.ddx = .3, this.sprite = 3);
    keyPressed(['a', 'arrowleft']) && this.dx > -2 && (this.ddx = -.3, this.sprite = 4);

    if (!this.spawning) {
      keyPressed(['s', 'arrowdown']) && this.dy < 2 && (this.ddy = .3);
      keyPressed(['w', 'arrowup']) && this.dy > -2 && (this.ddy = -.3);
    }

    !this.firing && keyPressed('space') && this.fireType === 0 && this.fire();
    !this.firing && keyPressed('space') && this.fireType === 1 && this.fire2();

    if (this.spawning) {
      this.ddy = -.1;
      this.scaleX = this.scaleY = clamp(1, 2, 2 - this.frame / 60);
    }

    this.shield <= 0 && this.die();

    this.advance();

    this.x < 4 && (this.x = 4, this.dx = 0);
    this.x > cw - 4 && (this.x = cw - 4, this.dx = 0);
    this.y < 4 && (this.y = 4, this.dy = 0);
    this.y > ch - 4 && (this.y = ch - 4, this.dy = 0);
  }
  draw() {
    const { context: ctx, x, y, width, height } = this;
    ctx.drawImage(this.spritesheet[0], this.spritesheet[1] * this.sprite, 0, width, height, 0, 0, width, height);

    let boost = 1;
    this.ddy < 0 && (boost = this.frame % 10 < 5 ? 2 : 3);
    ctx.fillStyle = '#FFaa33';
    ctx.fillRect(7, 13, 2, boost);
    ctx.fillStyle = '#FF6633';
    ctx.fillRect(this.frame % 10 < 5 ? 7 : 8, 13 + boost, 1, boost);

    if (this.fireLevel === 4) {
      ctx.fillStyle = '#FFF';
      ctx.fillRect( 22, 4, 2, 2);
      ctx.fillRect(-8, 4, 2, 2);
    }

    if (this.hitted) {
      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
    }

  }
}

function ship(props) { return new Ship(props); }

/**
 * A fast and memory efficient [object pool](https://gameprogrammingpatterns.com/object-pool.html) for sprite reuse. Perfect for particle systems or SHUMPs. The pool starts out with just one object, but will grow in size to accommodate as many objects as are needed.
 *
 * <canvas width="600" height="200" id="pool-example"></canvas>
 * <script src="assets/js/pool.js"></script>
 * @class Pool
 *
 * @param {Object} properties - Properties of the pool.
 * @param {() => {update: (dt?: Number) => void, render: Function, init: (properties?: Object) => void, isAlive: () => boolean}} properties.create - Function that returns a new object to be added to the pool when there are no more alive objects.
 * @param {Number} [properties.maxSize=1024] - The maximum number of objects allowed in the pool. The pool will never grow beyond this size.
 */
class Pool {
  /**
   * @docs docs/api_docs/pool.js
   */

  constructor({ create, maxSize = 1024 } = {}) {
    // @ifdef DEBUG
    // check for the correct structure of the objects added to pools
    // so we know that the rest of the pool code will work without
    // errors
    let obj;
    if (
      !create ||
      !(obj = create({id: ''})) ||
      !(obj.update && obj.init && obj.isAlive && obj.render)
    ) {
      throw Error(
        'Must provide create() function which returns an object with init(), update(), render(), and isAlive() functions'
      );
    }
    // @endif

    // c = create
    this._c = create;

    /**
     * All objects currently in the pool, both alive and not alive.
     * @memberof Pool
     * @property {Object[]} objects
     */
    this.objects = [create({id: ''})]; // start the pool with an object

    /**
     * The number of alive objects.
     * @memberof Pool
     * @property {Number} size
     */
    this.size = 0;

    /**
     * The maximum number of objects allowed in the pool. The pool will never grow beyond this size.
     * @memberof Pool
     * @property {Number} maxSize
     */
    this.maxSize = maxSize;
  }

  /**
   * Get and return an object from the pool. The properties parameter will be passed directly to the objects `init()` function. If you're using a [Sprite](api/sprite), you should also pass the `ttl` property to designate how many frames you want the object to be alive for.
   *
   * If you want to control when the sprite is ready for reuse, pass `Infinity` for `ttl`. You'll need to set the sprites `ttl` to `0` when you're ready for the sprite to be reused.
   *
   * ```js
   * // exclude-tablist
   * let sprite = pool.get({
   *   // the object will get these properties and values
   *   x: 100,
   *   y: 200,
   *   width: 20,
   *   height: 40,
   *   color: 'red',
   *
   *   // pass Infinity for ttl to prevent the object from being reused
   *   // until you set it back to 0
   *   ttl: Infinity
   * });
   * ```
   * @memberof Pool
   * @function get
   *
   * @param {Object} [properties] - Properties to pass to the objects `init()` function.
   *
   * @returns {Object} The newly initialized object.
   */
  get(properties = {}) {
    // the pool is out of objects if the first object is in use and
    // it can't grow
    if (this.size == this.objects.length) {
      if (this.size == this.maxSize) {
        return;
      }

      // double the size of the array by adding twice as many new
      // objects to the end
      for (
        let i = 0;
        i < this.size && this.objects.length < this.maxSize;
        i++
      ) {
        this.objects.push(this._c());
      }
    }

    // save off first object in pool to reassign to last object after
    // unshift
    let obj = this.objects[this.size];
    this.size++;
    obj.init(properties);
    return obj;
  }

  /**
   * Returns an array of all alive objects. Useful if you need to do special processing on all alive objects outside of the pool, such as to add all alive objects to a [Quadtree](api/quadtree).
   * @memberof Pool
   * @function getAliveObjects
   *
   * @returns {Object[]} An Array of all alive objects.
   */
  getAliveObjects() {
    return this.objects.slice(0, this.size);
  }

  /**
   * Clear the object pool. Removes all objects from the pool and resets its [size](api/pool#size) to 1.
   * @memberof Pool
   * @function clear
   */
  clear() {
    this.size = this.objects.length = 0;
    this.objects.push(this._c());
  }

  /**
   * Update all alive objects in the pool by calling the objects `update()` function. This function also manages when each object should be recycled, so it is recommended that you do not call the objects `update()` function outside of this function.
   * @memberof Pool
   * @function update
   *
   * @param {Number} [dt] - Time since last update.
   */
  update(dt) {
    let obj;
    let doSort = false;
    for (let i = this.size; i--; ) {
      obj = this.objects[i];

      obj.update(dt);

      if (!obj.isAlive()) {
        doSort = true;
        this.size--;
      }
    }
    // sort all dead elements to the end of the pool
    if (doSort) {
      this.objects.sort((a, b) => b.isAlive() - a.isAlive());
    }
  }

  /**
   * Render all alive objects in the pool by calling the objects `render()` function.
   * @memberof Pool
   * @function render
   */
  render() {
    for (let i = this.size; i--; ) {
      this.objects[i].render();
    }
  }
}

function pool(properties) {
  return new Pool(properties);
}

function starfield(vel = 1) {
  const starPool = pool({
    create: gameObject,
    maxSize: 480,
  });

  starPool.increaseVel = function (v) {
    this.objects.forEach(star => {
      star.dy = star.dy * v;
    });
  };

  starPool.decreaseVel = function (v) {
    this.objects.forEach(star => {
      star.dy = star.dy / v;
    });
  };

  starPool.velocity = vel;

  for (let i = -10; i < ch; i++) {
    const velocity = rnd(1, 3) * vel;
    const color = Math.floor((velocity / vel) * 50) + 50;
    i % 2 == 0 && starPool.get(
      {
        x: Math.floor(rnd(0, cw)),
        y: i,
        width: 1,
        height: 1 + (velocity / 4),
        dy: velocity / 4,
        color: `rgb(${color}, ${color}, ${color})`,
        update() {
          this.advance();
          if (this.y > ch) {
            this.y = -10;
          }
          this.height = 1 + (this.dy / 4);
        },
      }
    );
  }

  starPool.isAlive = () => true;
  return starPool;
}

class Asteroid extends GameObject {
  init(props) {
    const properties = {
      name: 'asteroid',
      spritesheet: [imageAssets['spritesheet16.png'], 16, 16],
      sprite: 1,
      width: 16,
      height: 16,
      color: null,
      anchor: { x: .5, y: .5 },
      shield: 10,
      ...props,
    };
    super.init(properties);
  }
  die() {
    emit('explosion', this.x, this.y, 50, 4, 'white');
    emit('score', 10);
    this.ttl = 0;
  }
  update() {
    this.rotation = this.frame / (10 / this.dy);
    this.advance();
    this.x < 0 || this.x > cw + 8 || this.y > ch + 8 && (this.ttl = 0);
  }
}

function asteroid(props) {
  return new Asteroid(props);
}

/**
 * Determine which subnodes the object intersects with
 *
 * @param {Object} object - Object to check.
 * @param {{x: Number, y: Number, width: Number, height: Number}} bounds - Bounds of the quadtree.
 *
 * @returns {Number[]} List of all subnodes object intersects.
 */
function getIndices(object, bounds) {
  let indices = [];

  let verticalMidpoint = bounds.x + bounds.width / 2;
  let horizontalMidpoint = bounds.y + bounds.height / 2;

  // save off quadrant checks for reuse
  let intersectsTopQuadrants = object.y < horizontalMidpoint;
  let intersectsBottomQuadrants =
    object.y + object.height >= horizontalMidpoint;

  // object intersects with the left quadrants
  if (object.x < verticalMidpoint) {
    if (intersectsTopQuadrants) {
      // top left
      indices.push(0);
    }

    if (intersectsBottomQuadrants) {
      // bottom left
      indices.push(2);
    }
  }

  // object intersects with the right quadrants
  if (object.x + object.width >= verticalMidpoint) {
    if (intersectsTopQuadrants) {
      // top right
      indices.push(1);
    }

    if (intersectsBottomQuadrants) {
      // bottom right
      indices.push(3);
    }
  }

  return indices;
}

// the quadtree acts like an object pool in that it will create
// subnodes as objects are needed but it won't clean up the subnodes
// when it collapses to avoid garbage collection.
//
// the quadrant indices are numbered as follows (following a z-order
// curve):
//     |
//  0  |  1
// ----+----
//  2  |  3
//     |

/**
 * A 2D [spatial partitioning](https://gameprogrammingpatterns.com/spatial-partition.html) data structure. Use it to quickly group objects by their position for faster access and collision checking.
 *
 * <canvas width="600" height="200" id="quadtree-example"></canvas>
 * <script src="assets/js/quadtree.js"></script>
 * @class Quadtree
 *
 * @param {Object} [properties] - Properties of the quadtree.
 * @param {Number} [properties.maxDepth=3] - Maximum node depth of the quadtree.
 * @param {Number} [properties.maxObjects=25] - Maximum number of objects a node can have before splitting.
 * @param {{x: Number, y: Number, width: Number, height: Number}} [properties.bounds] - The 2D space (x, y, width, height) the quadtree occupies. Defaults to the entire canvas width and height.
 */
class Quadtree {
  /**
   * @docs docs/api_docs/quadtree.js
   */

  constructor({ maxDepth = 3, maxObjects = 25, bounds } = {}) {
    /**
     * Maximum node depth of the quadtree.
     * @memberof Quadtree
     * @property {Number} maxDepth
     */
    this.maxDepth = maxDepth;

    /**
     * Maximum number of objects a node can have before splitting.
     * @memberof Quadtree
     * @property {Number} maxObjects
     */
    this.maxObjects = maxObjects;

    /**
     * The 2D space (x, y, width, height) the quadtree occupies.
     * @memberof Quadtree
     * @property {{x: Number, y: Number, width: Number, height: Number}} bounds
     */
    let canvas = getContext().canvas; // getCanvas();
    this.bounds = bounds || {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height
    };

    // since we won't clean up any subnodes, we need to keep track of
    // which nodes are currently the leaf node so we know which nodes
    // to add objects to
    // b = branch, d = depth, o = objects, s = subnodes, p = parent
    this._b = false;
    this._d = 0;
    this._o = [];
    this._s = [];
    this._p = null;
  }

  /**
   * Removes all objects from the quadtree. You should clear the quadtree every frame before adding all objects back into it.
   * @memberof Quadtree
   * @function clear
   */
  clear() {
    this._s.map(subnode => {
      subnode.clear();
    });

    this._b = false;
    this._o.length = 0;
  }

  /**
   * Get an array of all objects that belong to the same node as the passed in object.
   *
   * **Note:** if the passed in object is also part of the quadtree, it will not be returned in the results.
   *
   * ```js
   * import { Sprite, Quadtree } from 'kontra';
   *
   * let quadtree = Quadtree();
   * let player = Sprite({
   *   // ...
   * });
   * let enemy1 = Sprite({
   *   // ...
   * });
   * let enemy2 = Sprite({
   *   // ...
   * });
   *
   * quadtree.add(player, enemy1, enemy2);
   * quadtree.get(player);  //=> [enemy1]
   * ```
   * @memberof Quadtree
   * @function get
   *
   * @param {{x: Number, y: Number, width: Number, height: Number}} object - Object to use for finding other objects. The object must have the properties `x`, `y`, `width`, and `height` so that its position in the quadtree can be calculated.
   *
   * @returns {Object[]} A list of objects in the same node as the object, not including the object itself.
   */
  get(object) {
    // since an object can belong to multiple nodes we should not add
    // it multiple times
    let objects = new Set();

    // traverse the tree until we get to a leaf node
    while (this._s.length && this._b) {
      getIndices(object, this.bounds).map(index => {
        this._s[index].get(object).map(obj => objects.add(obj));
      });

      return Array.from(objects);
    }

    // don't add the object to the return list
    /* eslint-disable-next-line no-restricted-syntax */
    return this._o.filter(obj => obj !== object);
  }

  /**
   * Add objects to the quadtree and group them by their position. Can take a single object, a list of objects, and an array of objects.
   *
   * ```js
   * import { Quadtree, Sprite, Pool, GameLoop } from 'kontra';
   *
   * let quadtree = Quadtree();
   * let bulletPool = Pool({
   *   create: Sprite
   * });
   *
   * let player = Sprite({
   *   // ...
   * });
   * let enemy = Sprite({
   *   // ...
   * });
   *
   * // create some bullets
   * for (let i = 0; i < 100; i++) {
   *   bulletPool.get({
   *     // ...
   *   });
   * }
   *
   * let loop = GameLoop({
   *   update: function() {
   *     quadtree.clear();
   *     quadtree.add(player, enemy, bulletPool.getAliveObjects());
   *   }
   * });
   * ```
   * @memberof Quadtree
   * @function add
   *
   * @param {...({x: Number, y: Number, width: Number, height: Number}|{x: Number, y: Number, width: Number, height: Number}[])[]} objects - Objects to add to the quadtree. Can be a single object, an array of objects, or a comma-separated list of objects.
   */
  add(...objects) {
    objects.flat().map(object => {
      // current node has subnodes, so we need to add this object
      // into a subnode
      if (this._b) {
        this._a(object);
        return;
      }

      // this node is a leaf node so add the object to it
      this._o.push(object);

      // split the node if there are too many objects
      if (
        this._o.length > this.maxObjects &&
        this._d < this.maxDepth
      ) {
        this._sp();

        // move all objects to their corresponding subnodes
        this._o.map(obj => this._a(obj));
        this._o.length = 0;
      }
    });
  }

  /**
   * Add an object to a subnode.
   *
   * @param {Object} object - Object to add into a subnode
   */
  _a(object) {
    // add the object to all subnodes it intersects
    getIndices(object, this.bounds).map(index => {
      this._s[index].add(object);
    });
  }

  /**
   * Split the node into four subnodes.
   */
  // @see https://github.com/jed/140bytes/wiki/Byte-saving-techniques#use-placeholder-arguments-instead-of-var
  _sp(subWidth, subHeight, i) {
    this._b = true;

    // only split if we haven't split before
    if (this._s.length) {
      return;
    }

    subWidth = (this.bounds.width / 2) | 0;
    subHeight = (this.bounds.height / 2) | 0;

    for (i = 0; i < 4; i++) {
      this._s[i] = new Quadtree({
        bounds: {
          x: this.bounds.x + (i % 2 == 1 ? subWidth : 0), // nodes 1 and 3
          y: this.bounds.y + (i >= 2 ? subHeight : 0), // nodes 2 and 3
          width: subWidth,
          height: subHeight
        },
        maxDepth: this.maxDepth,
        maxObjects: this.maxObjects
      });

      // d = depth, p = parent
      this._s[i]._d = this._d + 1;
    }
  }
}

function quadtree(props) {
  return new Quadtree(props);
}

class Enemy extends GameObject {
  init(props) {
    const properties = {
      name: 'enemy',
      sprite: 3,
      color: null,
      anchor: { x: .5, y: .5 },
      shield: 1,
      frame: 0,
      loop: true,
      firstRun: true,
      debryColor: 'white',
      fireRate: 200,
      speed: 1,
      ...props,
    };

    super.init(properties);
    this.path && (this.ttl = Math.floor(properties.path.getTotalLength() / this.speed));
    this.loop && (this.ttl = Infinity);
  }
  fire() {
    emit('enemy-fire', this.x - 4, this.y - 4, this.rotation, 3);
  }
  die() {
    emit('explosion', this.x, this.y, 20, 3, this.debryColor);
    emit('score', 10);
    this.ttl = 0;
  }
  update () {
    this.rotation = degToRad(180);

    if (this.path) {
      const xy = this.path.getPointAtLength(this.frame * this.speed);
      const nextXy = this.path.getPointAtLength(this.frame * this.speed + 1);
      this.x = Math.floor(xy.x);
      this.y = Math.floor(xy.y);
      this.rotate && (this.rotation = degToRad(90) + (angleToTarget(xy, nextXy)));
    } else {
      this.x = this.parent.x + Math.cos(this.frame / this.parent.childrenSpeed + this.anglePlacement) * this.parent.childrenRadius;
      this.y = this.parent.y + Math.sin(this.frame / this.parent.childrenSpeed + this.anglePlacement) * this.parent.childrenRadius;
    }

    // if (this.rotate) {
    //   this.rotation = degToRad(90) + (angleToTarget(xy, nextXy));
    // } else {
    //   this.rotation = degToRad(180);
    // }

    this.firstRun && (this.scaleX = this.scaleY = clamp(0, 1, (this.frame * this.speed + 1) / 100));
    !this.loop && this.ttl < (100) && (this.scaleX = this.scaleY = clamp(0, 1, (this.ttl) / 100));

    // Imunity via scale? why not?
    this.scaleX < 1 && (this.imune = true);
    this.scaleX >= 1 && (this.imune = false);

    // Only fire when the enemy is fully visible, using scale...
    this.scaleX == 1 && this.frame % this.fireRate === 0 && this.fire();

    this.path && (this.frame * this.speed) >= this.path.getTotalLength() && this.loop && (this.frame = 0, this.firstRun = false);

    this.frame++;
    this.ttl--;
  }
}

function enemy(props) {
  return new Enemy(props);
}

class Boss extends Enemy {
  init(props) {
    const properties = {
      name: 'boss',
      spritesheet: [imageAssets['spritesheet16.png'], 16, 16],
      sprite: 0,
      width: 16,
      height: 16,
      color: null,
      shield: 10,
      debryColor: 'white',
      fireRate: 200,
      firing: false,
      loop: false,
      imune: true,
      showStatus: false,
      timers: [],
      ...props,
    };

    super.init(properties);

    this.maxShield = this.shield;
  }
  hit(damage) {
    super.hit(damage);
    this.showStatus = true;
    delay(() => {this.showStatus = false;}, 1000);
  }
  fire() {
    this.firing = true;
    this.imune = false;
    this.timers[0] = delay(() => {emit('boss-fire', this.x, this.y, this.rotation, 3);}, 400);
    this.timers[1] = delay(() => {emit('boss-fire', this.x, this.y, this.rotation, 3);}, 800);
    this.timers[2] = delay(() => {emit('boss-fire', this.x, this.y, this.rotation, 3);}, 1200);
    delay(() => {this.firing = false; this.imune = true;}, 1600);
  }
  die() {
    emit('explosion', this.x, this.y, 70, 6, this.debryColor, true);
    emit('score', 10);
    this.ttl = 0;
    this.timers.map(timer => clearTimeout(timer));
    emit('boss-die');
  }
  update() {
    !this.firing && super.update();
    !this.firing && (this.imune = true);
  }
  draw() {
    super.draw();

    if (!this.showStatus) return;

    const { context: ctx } = this;
    const bar = 20 * this.shield / this.maxShield;

    ctx.save();

    ctx.translate(this.width / 2, this.height / 2);
    ctx.rotate(-this.rotation);

    ctx.fillStyle = "white";
    ctx.fillRect(-12, -16 , 24, 6);

    ctx.fillStyle = "black";
    ctx.fillRect(-11, -15 , 22, 4);

    ctx.fillStyle = "green";
    if (this.shield < this.maxShield / 4) {
      ctx.fillStyle = "red";
    }
    ctx.fillRect(-10, -14 , bar, 2);

    ctx.restore();
  }
}

function boss(props) {
  return new Boss(props);
}

class Dialog extends GameObject {
  init(props) {
    const properties = {
      name: 'dialog',
      x: -16,
      y: 200,
      sprites: [10, 11, 12, 13, 14],
      text: text({text: '', x: 16, y: 8, align: 'left'}),
      textIndex: 0,
      texts: [],
      textsIndex: 0,
      spriteIndex: 0,
      frame: 0,
      anchor: { x: 0, y: 0 },
      talking: false,
      isTalking: false,
      stopping: false,
      pauseOnTalk: true,
      ...props,
    };
    super.init(properties);
  }
  skip() {
    if (this.texts.length == 0 || this.textsIndex > this.texts.length) return;
    this.textIndex = this.texts[this.textsIndex].length;
  }
  start(dialog) {
    this.stopping = false;
    setTimeout(() => {
      this.isTalking = true;
      this.texts = ['', ...dialog.texts];
      this.frame = 0;
      this.pauseOnTalk = dialog.pauseOnTalk;
    }, 1000);
    this.dx = 2;
  }
  stop() {
    this.stopping = true;
    this.text.text = '        ';
    this.isTalking = false;
    setTimeout(() => {
      this.texts = [];
      this.textsIndex = 0;
      this.textIndex = 0;
      this.frame = 0;
    }, 1000);
    this.dx = -2;
  }
  update() {
    this.x > 8 && (this.dx = 0, this.x = 8);
    this.y < -16 && (this.dx = 0, this.x = -16);
    if (this.texts.length == 0) return;
    this.talking = false;
    let t = this.texts[this.textsIndex] + '      ';
    t[this.textIndex] !== ' ' && (this.talking = true);
    this.frame % 5 == 0 && (this.textIndex++, t[this.textIndex] !== ' ' && zzfxP(dataAssets['typing']));
    this.textsIndex < this.texts.length && (this.text.text = t.slice(0, this.textIndex));
    this.frame++;
    if (this.textIndex >= t.length) {      
      this.textsIndex++;
      this.frame = 0;
      this.textIndex = 0;
    }    this.textsIndex >= this.texts.length && (!this.stopping && this.stop());
    this.talking && (this.frame % 5 == 0 && this.spriteIndex++);
    this.spriteIndex >= this.sprites.length && (this.spriteIndex = 0);
    super.update();
  }
  draw() {
    const { context: ctx, spritesheet } = this;
    ctx.fillStyle = 'white';
    ctx.fillRect(-2, -2, 12, 12);
    ctx.drawImage(spritesheet[0], this.sprites[this.spriteIndex] * 8, 0, 8, 8, 0, 0, 8, 8);
    ctx.translate(16, 0);
    this.text.draw();
  }
}

const dialog = (props) => new Dialog(props);

function checkCollisions(source, targets) {
  if (!source.isAlive()) return;
  targets.forEach(target => {
    if (source.name === 'enemy' && target.name === 'enemy') return;

    if (target.isAlive() && !source.imune && !target.imune && collides(target, source)) {
      if (source.name == 'ship-bullet' && !target.imune) {
        source.ttl = 0;
        target.hit(1);
      }

      if (source.name == 'ship' && (target.name == 'asteroid' || target.name == 'boss')) {
        source.die();
        source.ttl = 0;
        target.hit(5);
      }

      if (source.name == 'ship' && target.name == 'enemy') {
        target.die();
        target.ttl = 0;
        source.hit(50);
      }

      if (source.name == 'ship' && target.name == 'enemy-bullet') {
        target.ttl = 0;
        source.hit(10);
      }

      if (source.name == 'ship' && target.name == 'powerup' && !target.taken) {
        target.die();
        source.powerUp(target);
      }
    }
  });
}

class Powerup extends GameObject {
  init(props) {
    super.init({
      name: 'powerup',
      type: 'fire',
      width: 17,
      height: 17,
      taken: false,
      // ttl: 600,
      anchor: { x: .5, y: .5 },
      spritesheet: [imageAssets['font-white.png'], 9, 9],
      ...props,
    });
  }
  die() {
    this.taken = true;
    this.ttl = 10;
    this.frame = 0;
  }
  update() {
    this.y > 248 && (this.ttl = 0);

    if (this.frame % 100 === 0 && !this.taken) {
      if (this.type === 'fire') {
        this.type = 'laser';
      } else if (this.type === 'laser') {
        this.type = 'fire';
      }
    }

    super.update();
  }
  draw() {
    const { context: ctx, type, taken, frame } = this;

    let color, sprite;
    type === 'shield' && (color = 'yellow', sprite = 18);
    type === 'fire' && (color = 'red', sprite = 1);
    type === 'laser' && (color = 'lightblue', sprite = 11);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    if (frame % 20 < 10 && !taken) {
      ctx.strokeRect(0, 0, 17, 17);
    }

    ctx.fillStyle = color;
    ctx.fillRect(3, 3, 11, 11);
    ctx.drawImage(this.spritesheet[0], 9 * sprite, 0, 9, 9, 4, 4, 9, 9);

    if (taken) {
      ctx.globalAlpha = 1 - this.frame / 10;
      ctx.strokeRect(-this.frame, -this.frame, 17 + (this.frame * 2), 17 + (this.frame * 2));
      ctx.globalAlpha = 1;
    }
  }
}

function powerup$1(props) {
  return new Powerup(props);
}

var spiral = 'M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z';

var zigzag = 'M287 13-21 61l293 46-293 31 293 48-290 52';

var zigzagLeft = 'm-21 13 308 48-293 46 293 31-293 48 291 52';

var zzLeft = 'm20 7 50 48-48 46 48 31-48 48 48 52';

var zzRight = 'm237 7-50 48 48 46-48 31 48 48-48 52';

var sandClock = 'M121 123S-30 40 24 24C78 6 168 7 233 24 298 40-40 214 24 227c63 12 159 12 209 0 51-12-112-104-112-104Z';

var w = 'M223-33v238c0 42-61 41-61 0V41c0-44-64-44-64 0v164c0 43-71 33-71 0V-27';

var wReversed = 'M27-33v238c0 42 61 41 61 0V41c0-44 64-44 64 0v164c0 43 71 33 71 0V-27';

const paths = {spiral, zigzag, zigzagLeft, zzLeft, zzRight, sandClock, w, wReversed};

function getPath(path) {
  return paths[path];
}

var l01 = [
  { // enemies
    500: [
      3, // total
      400, // interval
      4, // sprite
      true, // rotate
      true, // loop
      1, // shield
      0, // fire mode
      200, // fire rate
      getPath('sandClock'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
    1000: [
      3, // total
      400, // interval
      5, // sprite
      true, // rotate
      true, // loop
      2, // shield
      0, // fire mode
      200, // fire rate
      getPath('sandClock'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
  },
  { // asteroids
  }, 
  { // powerups
    1500: [
      'fire', // type
      128, // x
      .6, // velocity
    ],
  },
  { // dialogs
    100: [
      false, // pause gameplay
      [
        'CAPTAIN',
        '    ',
        'WE DETECTED SOME ENEMY SCOUTS',
        'BETTER DESTROY THEM'
      ], // texts
    ],
    1000: [
      false, // pause gameplay
      [
        'TOO LATE!',
        'THEY ARE COMING',
        'WITH A FULL FLEET',
        '    ',
        'GOOD LUCK!'
      ], // texts
    ],
  },
  [ // boss
    // 0, // sprite
    // 10, // shield
    // 350, // fire rate
    // getPath('spiral'), // path
    // // 'M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z', // path
    // 30, // boss radius
    // 4, // total children
    // 3, // children sprite
    // 0, // fire mode children
    // 60, // children speed
    // 450, // children fire rate
  ],
];

var l02 = [
  { // enemies
    1000: [ // frame
      3, // total
      1000, // interval (ms) frame = 1000 / 1000 * 60 = 60
      3, // sprite
      true, // rotate
      false, // loop
      1, // shield
      0, // fire mode
      200, // fire rate
      getPath('zigzag'), // path
    ],
    2000: [
      5, // total
      1500, // interval
      6, // sprite
      false, // rotate
      false, // loop
      1, // shield
      0, // fire mode
      130, // fire rate
      getPath('zigzagLeft'), // path
    ],
  },
  { // asteroids
    // 2000: [
    //   20, // total
    //   1000, // interval ms
    //   [20, 200, 120, 180, 60, 220, 180, 40, 120, 60], // x positions
    //   [.1, -.1, 0, -.1, .1, -.1, 0, .1, 0, .1], // dx speeds
    //   [1, .5, .7, .5, .9, .5, 1, .8, .4, .7], // dy speeds
    // ],
  }, 
  { // powerups
    2500: [
      'fire', // type
      128, // x
      .6, // velocity
    ],
    550: [
      'shield', // type
      140, // x
      .3, // velocity
    ],
  },
  { // dialogs
    100: [
      false, // pause gameplay
      [
        'TOO LATE!',
        'THEY ARE COMING',
        'WITH A FULL FLEET',
        '    ',
        'GOOD LUCK!'
      ], // texts
    ],
    // 500: [
    //   false, // pause gameplay
    //   [
    //     'A FULL WAVE IS IMINENT',
    //     '    ',
    //   ], // texts
    // ],
  },
  [ // boss
    0, // sprite
    10, // shield
    50, // fire rate
    'M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z', // path
    30, // boss radius
    8, // total children
    9, // children sprite
    1, // fire mode children
    20, // children speed
    150, // children fire rate
  ],
];

var l03 = [
  { // enemies
    // 2000: [ // frame
    //   3, // total
    //   1000, // interval (ms) frame = 1000 / 1000 * 60 = 60
    //   3, // sprite
    //   true, // rotate
    //   false, // loop
    //   1, // shield
    //   0, // fire mode
    //   200, // fire rate
    //   'M223-33v238c0 42-61 41-61 0V41c0-44-64-44-64 0v164c0 43-71 33-71 0V-27', // path
    // ],
    // 1000: [
    //   5, // total
    //   1500, // interval
    //   6, // sprite
    //   false, // rotate
    //   false, // loop
    //   1, // shield
    //   0, // fire mode
    //   130, // fire rate
    //   'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    // ],
    // 3000: [
    //   5, // total
    //   1500, // interval
    //   8, // sprite
    //   true, // rotate
    //   false, // loop
    //   1, // shield
    //   0, // fire mode
    //   130, // fire rate
    //   'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    // ],
    // 4000: [
    //   5, // total
    //   1500, // interval
    //   6, // sprite
    //   false, // rotate
    //   false, // loop
    //   1, // shield
    //   0, // fire mode
    //   130, // fire rate
    //   'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    // ],
    // 5000: [
    //   5, // total
    //   1500, // interval
    //   6, // sprite
    //   false, // rotate
    //   false, // loop
    //   1, // shield
    //   0, // fire mode
    //   130, // fire rate
    //   'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    // ],
  },
  { // asteroids
    1000: [
      13, // total
      1000, // interval ms
      [20, 200, 120, 180, 60, 220, 180, 40, 120, 60], // x positions
      [0, -.1, 0, -.1, .1, -.1, 0, .1, 0, .1], // dx speeds
      [1, .5, .7, .5, .9, .5, 1, .8, .4, .7], // dy speeds
    ],
  }, 
  { // powerups
    1500: [
      'fire', // type
      128, // x
      .6, // velocity
    ],
    2500: [
      'shield', // type
      140, // x
      .3, // velocity
    ],
    3500: [
      'fire', // type
      128, // x
      .6, // velocity
    ],
  },
  { // dialogs
    100: [
      false, // pause gameplay
      [
        '13 ASTEROIDS DETECTED',
        '      ',
        'OOOPSS...',
        'HOPE THIS DOES NOT TRIGGER',
        'YOUR TRISKAIDEKAPHOBIA...',
        '         ',
      ], // texts
    ],
  },
  [ // boss
    0, // sprite
    10, // shield
    100, // fire rate
    'M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z', // path
    40, // boss radius
    4, // total children
    9, // children sprite
    1, // fire mode children
    60, // children speed
    50, // children fire rate
  ],
];

var l04 = [
  { // enemies
    800: [
      5, // total
      400, // interval
      9, // sprite
      true, // rotate
      false, // loop
      4, // shield
      0, // fire mode
      400, // fire rate
      getPath('zigzag'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
    810: [
      5, // total
      400, // interval
      9, // sprite
      true, // rotate
      false, // loop
      4, // shield
      0, // fire mode
      400, // fire rate
      getPath('zigzagLeft'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
    2000: [
      5, // total
      400, // interval
      7, // sprite
      true, // rotate
      false, // loop
      4, // shield
      0, // fire mode
      400, // fire rate
      getPath('w'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
    2010: [
      5, // total
      400, // interval
      7, // sprite
      true, // rotate
      false, // loop
      4, // shield
      0, // fire mode
      400, // fire rate
      getPath('wReversed'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
  },
  { // asteroids
  }, 
  { // powerups
    1500: [
      'fire', // type
      128, // x
      .6, // velocity
    ],
  },
  { // dialogs
    100: [
      false, // pause gameplay
      [
        'THAT CONDITION STILL',
        'AFFECTING YOUR',
        'VISION, HUH!?',
        '         ',
      ], // texts
    ],
  },
  [ // boss
    0, // sprite
    10, // shield
    250, // fire rate
    getPath('sandClock'), // path
    // 'M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z', // path
    30, // boss radius
    8, // total children
    8, // children sprite
    0, // fire mode children
    10, // children speed
    50, // children fire rate
  ],
];

var l05 = [
  { // enemies
    2500: [
      14, // total
      200, // interval
      5, // sprite
      true, // rotate
      true, // loop
      1, // shield
      0, // fire mode
      50, // fire rate
      getPath('spiral'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
  },
  { // asteroids
    1000: [
      13, // total
      1000, // interval ms
      [20, 200, 120, 180, 60, 220, 180, 40, 120, 60], // x positions
      [0, -.1, 0, -.1, .1, -.1, 0, .1, 0, .1], // dx speeds
      [1, .5, .7, .5, .9, .5, 1, .8, .4, .7], // dy speeds
    ],
  }, 
  { // powerups
    1500: [
      'fire', // type
      128, // x
      .6, // velocity
    ],
  },
  { // dialogs
    100: [
      false, // pause gameplay
      [
        'HERE COME MORE ASTEROIDS',
        '12 PLUS 1, HEHE!',
        '         ',
        'ALSO 13 SHIPS',
        '        ',
        'OH MAN! NOT AGAIN!',
      ], // texts
    ],
  },
  [ // boss
    // 0, // sprite
    // 10, // shield
    // 350, // fire rate
    // getPath('spiral'), // path
    // // 'M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z', // path
    // 30, // boss radius
    // 4, // total children
    // 3, // children sprite
    // 0, // fire mode children
    // 60, // children speed
    // 450, // children fire rate
  ],
];

var l06 = [
  { // enemies
    500: [
      10, // total
      400, // interval
      3, // sprite
      false, // rotate
      false, // loop
      2, // shield
      0, // fire mode
      200, // fire rate
      getPath('zzLeft'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
    800: [
      10, // total
      400, // interval
      4, // sprite
      false, // rotate
      false, // loop
      2, // shield
      0, // fire mode
      200, // fire rate
      getPath('zzRight'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
    1500: [
      10, // total
      400, // interval
      3, // sprite
      false, // rotate
      false, // loop
      2, // shield
      0, // fire mode
      200, // fire rate
      getPath('zzLeft'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
    1800: [
      10, // total
      400, // interval
      4, // sprite
      false, // rotate
      false, // loop
      2, // shield
      0, // fire mode
      200, // fire rate
      getPath('zzRight'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
    2500: [
      5, // total
      1000, // interval
      6, // sprite
      false, // rotate
      false, // loop
      1, // shield
      0, // fire mode
      40, // fire rate
      getPath('spiral'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
  },
  { // asteroids
  }, 
  { // powerups
    1500: [
      'fire', // type
      128, // x
      .6, // velocity
    ],
  },
  { // dialogs
    100: [
      false, // pause gameplay
      [
        'HMMM... ZIGZAGERS?',
        '    ',
      ], // texts
    ],
  },
  [ // boss
    // 0, // sprite
    // 10, // shield
    // 350, // fire rate
    // getPath('spiral'), // path
    // // 'M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z', // path
    // 30, // boss radius
    // 4, // total children
    // 3, // children sprite
    // 0, // fire mode children
    // 60, // children speed
    // 450, // children fire rate
  ],
];

var l07 = [
  { // enemies
    500: [
      3, // total
      400, // interval
      4, // sprite
      true, // rotate
      false, // loop
      4, // shield
      1, // fire mode
      100, // fire rate
      getPath('spiral'), // path
    ],
    2000: [
      3, // total
      1000, // interval
      5, // sprite
      true, // rotate
      false, // loop
      4, // shield
      1, // fire mode
      100, // fire rate
      getPath('sandClock'), // path
    ],
  },
  { // asteroids
    500: [
      30, // total
      700, // interval ms
      [220, 180, 40, 120, 60, 20, 200, 120, 180, 60], // x positions
      [-.1, 0, .1, 0, .1, 0, -.1, 0, -.1, .1], // dx speeds
      [.5, 1, .8, .4, .7, 1, .5, .7, .5, .9], // dy speeds
    ],
  }, 
  { // powerups
    1500: [
      'shield', // type
      128, // x
      .6, // velocity
    ],
    500: [
      'fire', // type
      64, // x
      .3, // velocity
    ],
  },
  { // dialogs
    // 100: [
    //   false, // pause gameplay
    //   [
    //     'CAPTAIN',
    //     '    ',
    //     'WE DETECTED SOME ENEMY SCOUTS',
    //     'BETTER DESTROY THEM'
    //   ], // texts
    // ],
  },
  [ // boss
    0, // sprite
    60, // shield
    150, // fire rate
    getPath('sandClock'), // path
    30, // boss radius
    16, // total children
    8, // children sprite
    1, // fire mode children
    100, // children speed
    50, // children fire rate
  ],
];

var l08 = [
  { // enemies
    500: [ // frame
      5, // total
      1000, // interval (ms) frame = 1000 / 1000 * 60 = 60
      9, // sprite
      true, // rotate
      false, // loop
      1, // shield
      0, // fire mode
      100, // fire rate
      getPath('w'), // path
    ],
    501: [
      5, // total
      1000, // interval
      9, // sprite
      true, // rotate
      false, // loop
      1, // shield
      0, // fire mode
      100, // fire rate
      getPath('wReversed'), // path
    ],
    1500: [
      5, // total
      1000, // interval
      3, // sprite
      false, // rotate
      false, // loop
      1, // shield
      0, // fire mode
      100, // fire rate
      getPath('zzLeft'), // path
    ],
    1501: [
      5, // total
      1000, // interval
      3, // sprite
      false, // rotate
      false, // loop
      1, // shield
      0, // fire mode
      100, // fire rate
      getPath('zzRight'), // path
    ],
  },
  { // asteroids
    // 2000: [
    //   20, // total
    //   1000, // interval ms
    //   [20, 200, 120, 180, 60, 220, 180, 40, 120, 60], // x positions
    //   [.1, -.1, 0, -.1, .1, -.1, 0, .1, 0, .1], // dx speeds
    //   [1, .5, .7, .5, .9, .5, 1, .8, .4, .7], // dy speeds
    // ],
  }, 
  { // powerups
    2500: [
      'fire', // type
      128, // x
      .6, // velocity
    ],
    550: [
      'shield', // type
      140, // x
      .3, // velocity
    ],
  },
  { // dialogs
    100: [
      false, // pause gameplay
      [
        'THEY JUST KEEP COMING',
      ], // texts
    ],
    // 500: [
    //   false, // pause gameplay
    //   [
    //     'A FULL WAVE IS IMINENT',
    //     '    ',
    //   ], // texts
    // ],
  },
  [ // boss
    // 0, // sprite
    // 10, // shield
    // 50, // fire rate
    // 'M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z', // path
    // 30, // boss radius
    // 8, // total children
    // 9, // children sprite
    // 1, // fire mode children
    // 20, // children speed
    // 150, // children fire rate
  ],
];

var l09 = [
  { // enemies
    500: [ // frame
      1, // total
      1000, // interval (ms) frame = 1000 / 1000 * 60 = 60
      9, // sprite
      true, // rotate
      false, // loop
      10, // shield
      0, // fire mode
      30, // fire rate
      getPath('spiral'), // path
    ],
  },
  { // asteroids
    // 1000: [
    //   13, // total
    //   1000, // interval ms
    //   [20, 200, 120, 180, 60, 220, 180, 40, 120, 60], // x positions
    //   [0, -.1, 0, -.1, .1, -.1, 0, .1, 0, .1], // dx speeds
    //   [1, .5, .7, .5, .9, .5, 1, .8, .4, .7], // dy speeds
    // ],
  }, 
  { // powerups
    1500: [
      'fire', // type
      128, // x
      .6, // velocity
    ],
    2500: [
      'shield', // type
      140, // x
      .3, // velocity
    ],
    3500: [
      'fire', // type
      128, // x
      .6, // velocity
    ],
  },
  { // dialogs
    // 100: [
    //   false, // pause gameplay
    //   [
    //     '13 ASTEROIDS DETECTED',
    //     '      ',
    //     'OOOPSS...',
    //     'HOPE THIS DOES NOT TRIGGER',
    //     'YOUR TRISKAIDEKAPHOBIA...',
    //     '         ',
    //   ], // texts
    // ],
  },
  [ // boss
    0, // sprite
    20, // shield
    110, // fire rate
    getPath('spiral'), // path
    100, // boss radius
    8, // total children
    9, // children sprite
    1, // fire mode children
    60, // children speed
    100, // children fire rate
  ],
];

var l10 = [
  { // enemies
    1200: [
      13, // total
      400, // interval
      9, // sprite
      true, // rotate
      false, // loop
      4, // shield
      0, // fire mode
      400, // fire rate
      getPath('zigzag'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
    3500: [
      20, // total
      400, // interval
      9, // sprite
      true, // rotate
      false, // loop
      1, // shield
      0, // fire mode
      1000, // fire rate
      getPath('spiral'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
  },
  { // asteroids
    2000: [
      30, // total
      700, // interval ms
      [20, 200, 120, 180, 60, 220, 180, 40, 120, 60], // x positions
      [0, -.1, 0, -.1, .1, -.1, 0, .1, 0, .1], // dx speeds
      [1, .5, .7, .5, .9, .5, 1, .8, .4, .7], // dy speeds
    ],
  }, 
  { // powerups
    1500: [
      'fire', // type
      128, // x
      .6, // velocity
    ],
  },
  { // dialogs
    100: [
      false, // pause gameplay
      [
        'HMMM... DETECTING A SHIP',
        'WITH SOME TAG ON IT...',
        'A NUMBER, MAYBE?',
        'YEP, IT IS 13',
        'YIKES! I AM SORRY...',
      ], // texts
    ],
  },
  [ // boss
    0, // sprite
    30, // shield
    150, // fire rate
    getPath('sandClock'), // path
    // 'M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z', // path
    30, // boss radius
    8, // total children
    8, // children sprite
    0, // fire mode children
    100, // children speed
    500, // children fire rate
  ],
];

var l11 = [
  { // enemies
    2500: [
      13, // total
      200, // interval
      5, // sprite
      true, // rotate
      true, // loop
      1, // shield
      0, // fire mode
      50, // fire rate
      getPath('spiral'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
  },
  { // asteroids
    10: [
      60, // total
      400, // interval ms
      [20, 200, 120, 180, 60, 220, 180, 40, 120, 60], // x positions
      [0, -.1, 0, -.1, .1, -.1, 0, .1, 0, .1], // dx speeds
      [1, .5, .7, .5, .9, .5, 1, .8, .4, .7], // dy speeds
    ],
  }, 
  { // powerups
    1500: [
      'fire', // type
      128, // x
      .6, // velocity
    ],
  },
  { // dialogs
    3000: [
      false, // pause gameplay
      [
        'CONTROL YOURSELF, CAPTAIN!',
      ], // texts
    ],
  },
  [ // boss
    // 0, // sprite
    // 10, // shield
    // 350, // fire rate
    // getPath('spiral'), // path
    // // 'M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z', // path
    // 30, // boss radius
    // 4, // total children
    // 3, // children sprite
    // 0, // fire mode children
    // 60, // children speed
    // 450, // children fire rate
  ],
];

var l12 = [
  { // enemies
    1500: [
      10, // total
      400, // interval
      3, // sprite
      false, // rotate
      false, // loop
      2, // shield
      0, // fire mode
      200, // fire rate
      getPath('zzLeft'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
    1800: [
      10, // total
      400, // interval
      4, // sprite
      false, // rotate
      false, // loop
      2, // shield
      0, // fire mode
      200, // fire rate
      getPath('zzRight'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
    2500: [
      5, // total
      1000, // interval
      6, // sprite
      false, // rotate
      false, // loop
      1, // shield
      0, // fire mode
      40, // fire rate
      getPath('spiral'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
  },
  { // asteroids
  }, 
  { // powerups
    1500: [
      'fire', // type
      64, // x
      .6, // velocity
    ],
    1500: [
      'shield', // type
      156, // x
      .4, // velocity
    ],
  },
  { // dialogs
    100: [
      false, // pause gameplay
      [
        'I GOT A FEELING',
        'THIS NEVER ENDS',
        '       ',
        'MAYBE THAT IS WHY',
        'IT IS A GAME.',
        '       ',
        'OH WELL, LETS KEEP GOING.',
        'BUT HARDER THIS TIME. HEHE!',
      ], // texts
    ],
  },
  [ // boss
    // 0, // sprite
    // 10, // shield
    // 350, // fire rate
    // getPath('spiral'), // path
    // // 'M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z', // path
    // 30, // boss radius
    // 4, // total children
    // 3, // children sprite
    // 0, // fire mode children
    // 60, // children speed
    // 450, // children fire rate
  ],
];

const levels = [
  l01,
  l02,
  l03,
  l04,
  l05,
  l06,
  l07,
  l08,
  l09,
  l10,
  l11,
  l12,
];

function parseEnemy(data) {
  return {
    sprite: data[2],
    rotate: data[3],
    loop: data[4],
    shield: data[5],
    fireMode: data[6],
    fireRate: data[7],
    path: createPath(data[8]),
  };
}

function getLevelLastFrame(index) {
  const level = levels[index];
  // Get the max frame from all level.
  let lastFrame = Math.max(
    ...Object.keys(level[0]),
    ...Object.keys(level[1]),
  );

  // Get info from last enemy/asteroid and calculate the last frame
  // taking into total and interval.
  let o = level[0][lastFrame];
  o ?? (o = level[1][lastFrame]);
  lastFrame += o[1] / 1000 * 60 * o[0];

  return lastFrame;
}

const totalLevels = levels.length;

function processLevel(frame = 0, currentLevel = 0, totalActiveEnemies = 0, canSpawnBoss = false) {
  const level = levels[currentLevel];
  const lastFrame = getLevelLastFrame(currentLevel);

  // Enemies
  if (level[0][frame]) {
    const o = level[0][frame];
    emit('spawn-enemy', o[0], o[1], parseEnemy(o));
  }

  // Asteroids
  if (level[1][frame]) {
    emit('spawn-asteroid', ...level[1][frame]);
  }

  // Powerups
  if (level[2][frame]) {
    emit('spawn-powerup', ...level[2][frame]);
  }

  // Dialogs
  if (level[3][frame]) {
    emit('set-dialog', ...level[3][frame]);
  }

  // No boss? Go to next level.
  if (level[4].length === 0 && frame >= lastFrame && totalActiveEnemies === 0) {
    const newLevel = currentLevel + 1 >= totalLevels ? 0 : currentLevel + 1;
    emit('next-level', newLevel);
  }

  // Boss
  if (level[4].length > 0 && canSpawnBoss && totalActiveEnemies === 0) {
    emit('spawn-boss', ...level[4]);
  }
}

function gameScene() {
  onKey(['esc'], () => {
    emit('change-scene', 'menu');
  });
  onKey(['p'], () => {
    emit('pause');
  });
  offKey(['enter']);
  onKey(['enter'], () => dialogInstance.skip());

  const shipInstance = ship({ x: 120, y: 248 });
  const starPool = starfield(20);
  const dialogInstance = dialog();
  const blockingDialogInstance = dialog();
  let currentLevel = 0, virtualLevel = 0;
  let levelMultiplier = virtualLevel > 12 ? Math.floor(virtualLevel * 0.25) : 0;
  let frame = 0;
  let firstRun = true;
  let canSpawnBoss = false;
  let levelLastFrame = getLevelLastFrame(currentLevel);
  let noShieldPowerups = false;
  let fireTimer;

  const explosionPool = pool({
    create: explosionParticle,
    maxSize: 400,
  });

  const shipBulletPool = pool({
    create: gameObject,
    maxSize: 40,
  });

  const shipLaserPool = pool({
    create: gameObject,
    maxSize: 80,
  });

  const enemyBulletPool = pool({
    create: gameObject,
    maxSize: 400,
  });

  const asteroidPool = pool({
    create: asteroid,
    maxSize: 10,
  });

  const enemyPool = pool({
    create: enemy,
    maxSize: 50,
  });

  const bossPool = pool({
    create: boss,
    maxSize: 4,
  });

  const powerupPool = pool({
    create: powerup$1,
    maxSize: 4,
  });

  const textScore = text({
    text: 'SCORE 00000',
    x: 8,
    y: 8,
  });

  const textHi = text({
    text: `HI ${localStorage.getItem('hiScore') || 0}`,
    x: 128,
    y: 8,
    color: 'gray',
    align: 'center',
  });

  const textLives = text({
    x: 256 - 8 - 8 * 3,
    y: 8,
    text: '@@@',
    color: 'red',
  });

  const levelText = text({
    x: 128,
    y: 120,
    text: 'LEVEL 1',
    align: 'center',
    color: 'lightgreen',
    ttl: 0,
  });

  const fireTimerText = text({
    x: 256 - 8,
    y: 240 - 16,
    text: 'FIRE PODS :00',
    align: 'right',
    color: 'gray',
    ttl: 0,
  });

  const progressShield = gameObject({
    x: 256 - 8 * 8,
    y: 8,
    width: 24,
    height: 8,
    anchor: { x: 0, y: 0 },
    draw() {
      const { context: ctx } = this;
      const value = shipInstance.shield >= 0 ? shipInstance.shield / 5 : 0; // shipInstance.shield >= 0 ? 24 * shipInstance.shield / 100 : 0;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, this.width, this.height);

      ctx.fillStyle = 'green';
      shipInstance.shield < 25 && (ctx.fillStyle = 'red');
      ctx.fillRect(2, 2, value, this.height - 4);
    }
  });

  const visionEffect = gameObject({
    x: 0, y: 0, active: false, radius: 484,
    update() { },
    draw() {
      const { context: ctx } = this;
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.arc(shipInstance.x, shipInstance.y, this.radius, 0, Math.PI * 2, true);
      ctx.clip();
      ctx.stroke();
    },
    start() {
      zzfxP(dataAssets['transition']);
      this.radius = 484;
      this.active = true;
    },
    end() {
      zzfxP(dataAssets['transition']);
      this.active = false;
    },
    update() {
      this.active && this.radius > 60 && (this.radius -= 2);
      !this.active && this.radius < 484 && (this.radius += 1);
      this.advance();
    },
    render() {
      this.draw();
    }
  });

  const visionEffectEnd = gameObject({
    x: 0, y: 0,
    update() { },
    draw() {
      const { context: ctx } = this;
      ctx.restore();
    },
    render() {
      this.draw();
    }
  });

  on('hit', () => {
    zzfxP(dataAssets['hit']);
  });

  on('explosion', (x, y, volume, magnitude, color, big = false) => {
    const explosionSound = big ? 'bigExplosion' : 'explosion';
    zzfxP(dataAssets[explosionSound]);

    for (let i = 0; i < volume; i++) {
      i % 2 == 0 && explosionPool.get({
        x,
        y,
        dx: rnd(-1, 1) / 2,
        dy: rnd(-1, 1) / 2,
        color: null,
        ttl: 30,
      });

      explosionPool.get({
        x,
        y,
        dx: rnd(- magnitude / 2, magnitude / 2),
        dy: rnd(- magnitude / 2, magnitude / 2),
        color,
        ttl: 30 * magnitude,
      });
    }
  });

  on('ship-fire', (x, y, dx) => {
    zzfxP(dataAssets['shoot']);
    shipBulletPool.get({
      name: 'ship-bullet',
      x,
      y,
      width: 2,
      height: 4,
      dy: -4,
      dx,
      color: null,
      sprite: 16,
      ttl: 100,
      update() {
        this.advance();
        if (this.y < 0) this.ttl = 0;
      }
    });
  });

  on('ship-fire-laser', (x, y, dx, volume = .4) => {
    const laser = dataAssets['laser'];
    laser[0] = volume;
    zzfxP(laser);
    shipLaserPool.get({
      name: 'ship-bullet',
      x,
      y,
      width: 2,
      height: 18,
      dy: -10,
      dx,
      rotation: dx / 10,
      color: null,
      // sprite: 16,
      ttl: 100,
      update() {
        this.advance();
        if (this.y < 0) this.ttl = 0;
      },
      draw() {
        const { context: ctx } = this;
        ctx.fillStyle = '#0cc';
        ctx.fillRect(-1, -1, this.width + 2, this.height);
        ctx.fillStyle = '#0ff';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.fillStyle = '#fff';
        ctx.fillRect(1, 1, this.width / 2, this.height);
      }
    });
  });

  on('ship-die', () => {
    emit('spawn-powerup', 'fire', 128, .6);
  });

  on('enemy-fire', (x, y) => {
    zzfxP(dataAssets['shoot']);
    const vx = (shipInstance.x - 4) - x;
    const vy = (shipInstance.y - 4) - y;
    const dist = Math.hypot(vx, vy) / 1;

    enemyBulletPool.get({
      name: 'enemy-bullet',
      x: x + 4,
      y: y + 4,
      dx: vx / dist,
      dy: vy / dist,
      width: 3,
      height: 3,
      color: 'red',
      ttl: 300,
      draw() {
        const { context: ctx } = this;
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(1, 1, 1, 1);
      }
    });
  });

  on('boss-fire', (x, y) => {
    zzfxP(dataAssets['shoot2']);

    for (let i = 0; i < 12; i++) {
      const dx = Math.cos(degToRad(30 * i)) * 1;
      const dy = Math.sin(degToRad(30 * i)) * 1;
      enemyBulletPool.get({
        name: 'enemy-bullet',
        x: x,
        y: y,
        dx,
        dy,
        width: 3,
        height: 3,
        color: 'red',
        ttl: 400,
      });
    }
  });

  on('score', value => {
    shipInstance.score += Math.floor(value + (levelMultiplier * 2));
  });

  on('spawn-boss', (
    sprite,
    shield,
    fireRate,
    path,
    childrenRadius,
    totalChildren,
    spriteChildren,
    fireModeChildren,
    childrenSpeed,
    fireRateChildren,
  ) => {
    canSpawnBoss = false;

    let bossInstance = bossPool.get({
      sprite,
      shield,
      fireRate,
      rotate: false,
      loop: true,
      imune: true,
      debryColor: 'pink',
      childrenSpeed,
      childrenRadius,
      path: createPath(path),
    });

    emit('spawn-enemy', totalChildren, 0, {
      sprite: spriteChildren,
      shield: 2,
      fireRate: fireRateChildren,
      fireMode: fireModeChildren,
      parent: bossInstance,
      path: null,
    });
  });

  on('spawn-enemy', (total, interval, props) => {
    if (total === 13) {
      visionEffect.start();
      delay(() => visionEffect.end(), 15000);
    }
    total = total + levelMultiplier;
    for (let i = 0; i < total; i++) {
      const angle = i * (360 / total);
      const speed = clamp(1, 2, props.sprite / 4);
      delay((angle) => {
        enemyPool.get({
          ...props,
          speed,
          anglePlacement: degToRad(angle),
          shield: props.shield + levelMultiplier,
        });
      }, i * interval, angle);
    }
  });

  on('spawn-asteroid', (total, interval, positions, speedsX, speedsY) => {
    if (total === 13) {
      visionEffect.start();
      delay(() => visionEffect.end(), 15000);
    }

    let vi = 0;
    for (let i = 0; i < total; i++) {
      vi > positions.length - 1 && (vi = 0);

      delay((i, vi) => {
        asteroidPool.get({
          x: positions[vi],
          y: -8,
          dx: speedsX[vi],
          dy: speedsY[vi],
          shield: 10 + levelMultiplier,
        });
      }, i * interval, i, vi);

      vi++;
    }
  });

  on('spawn-powerup', (type, x, dy) => {
    if (type === 'shield' && noShieldPowerups) return;
    powerupPool.get({ type, x, y: -8, dy });
  });

  on('set-dialog', (pauseOnTalk, texts) => {
    if (pauseOnTalk) {
      blockingDialogInstance.start({
        texts,
        pauseOnTalk: true,
      });  
    } else {
      dialogInstance.start({
        texts,
        pauseOnTalk: false,
      });  
    }
  });

  on('next-level', level => {
    canSpawnBoss = false;
    currentLevel = level;
    virtualLevel++;
    frame = 0;
    firstRun = false;
    levelLastFrame = getLevelLastFrame(level);
    levelMultiplier = virtualLevel > 12 ? Math.floor(virtualLevel * 0.25) : 0;
    emit('score', 100);
    if (virtualLevel === 12) emit('level-13');
    if (virtualLevel === 25) emit('level-26');
  });

  on('boss-die', () => {
    emit('score', 200);
    currentLevel++;
    currentLevel >= totalLevels && (currentLevel = 0);
    emit('next-level', currentLevel);
  });

  on('game-over', () => {
    const hiScore = localStorage.getItem('hiScore') || 0;
    shipInstance.score > hiScore && localStorage.setItem('hiScore', shipInstance.score);
    emit('change-scene', 'game-over', { score: shipInstance.score, previous: hiScore });
  });

  on('start-fire-timer', () => {
    fireTimer = performance.now() + 30000;
    fireTimerText.ttl = Infinity;
  });

  on('end-fire-timer', () => {
    fireTimer = null;
    fireTimerText.ttl = 0;
  });

  on('level-13', () => {
    emit('set-dialog', true, [
      'LETS MAKE THIS',
      'INSTERESTING.',
      'NOW WITH ONE LIFE ONLY',
    ]);
    shipInstance.lives = 1;
    shipInstance.shield = 100;
  });

  on('level-26', () => {
    emit('set-dialog', true, [
      'HEY! YOU ARE GOOD AT THIS!',
      'NOW ONE HIT AND YOU DIE!',
      'AND NO SHIELD POWERUPS.'
    ]);
    shipInstance.lives = 1;
    shipInstance.shield = 10;
    noShieldPowerups = true;
  });


  const qtShipBullets = quadtree();
  const qtShip = quadtree();
  const qtAsteroids = quadtree();

  return scene({
    children: [
      visionEffect,
      starPool,
      shipBulletPool,
      shipLaserPool,
      enemyBulletPool,
      shipInstance,
      enemyPool,
      bossPool,
      asteroidPool,
      powerupPool,
      explosionPool,
      visionEffectEnd,
      dialogInstance,
      blockingDialogInstance,
      progressShield,
      levelText,
      textScore,
      textHi,
      textLives,
      fireTimerText,
    ],
    gameOver: false,
    update() {
      this.paused = false;
      if (blockingDialogInstance.isTalking && blockingDialogInstance.pauseOnTalk) {
        blockingDialogInstance.update();
        this.paused = true;
        return;
      }

      // if (frame < 40) {
      //   levelText.text = `LEVEL ${virtualLevel + 1}`;
      //   levelText.ttl = 100;
      // }

      fireTimerText.text = `PODS ${fireTimer ? Math.floor((fireTimer - performance.now()) / 1000) : '00'}`;

      const totalEnemies = enemyPool.size + asteroidPool.size;
      frame === levelLastFrame && (canSpawnBoss = true);
      processLevel(frame, currentLevel, totalEnemies, canSpawnBoss);

      if (shipInstance.lives <= 0 && !this.gameOver) {
        this.gameOver = true;
        delay(() => emit('game-over'), 1000);
        return;
      }

      shipBulletPool.getAliveObjects().forEach(bullet => {
        qtShipBullets.clear();
        qtShipBullets.add(bullet, asteroidPool.getAliveObjects(), enemyPool.getAliveObjects(), bossPool.getAliveObjects());
        checkCollisions(bullet, qtShipBullets.get(bullet));
      });

      shipLaserPool.getAliveObjects().forEach(bullet => {
        qtShipBullets.clear();
        qtShipBullets.add(bullet, asteroidPool.getAliveObjects(), enemyPool.getAliveObjects(), bossPool.getAliveObjects());
        checkCollisions(bullet, qtShipBullets.get(bullet));
      });


      qtShip.clear();
      qtShip.add(
        shipInstance,
        asteroidPool.getAliveObjects(),
        enemyPool.getAliveObjects(),
        enemyBulletPool.getAliveObjects(),
        bossPool.getAliveObjects(),
        powerupPool.getAliveObjects(),
      );
      checkCollisions(shipInstance, qtShip.get(shipInstance));

      qtAsteroids.clear();
      qtAsteroids.add(asteroidPool.getAliveObjects());
      asteroidPool.getAliveObjects().forEach(asteroid => {
        checkCollisions(asteroid, qtAsteroids.get(asteroid));
      });

      textScore.text = `SCORE ${shipInstance.score}`;
      textLives.text = `@@@`.slice(0, shipInstance.lives);

      firstRun && frame > 40 && frame < 140 && frame % 20 === 0 && starPool.decreaseVel(2);
      firstRun && frame === 0 && zzfxP(dataAssets['engineSlowdown']);
      frame++;
    },
  });
}

function menuScene() {
  onKey(['enter'], () => {
    emit('change-scene', 'game');
  });
  onKey(['c'], () => {
    emit('change-scene', 'credits', { reset: false });
  });
  offKey(['esc']);
  const starPool = starfield(90);

  const title = gameObject({
    x: 128,
    y: 48,
    anchor: { x: 0.5, y: 0.5 },
    width: 256,
    height: 100,
    scaleX: 0.01,
    scaleY: 0.01,
    image: imageAssets['title.png'],
    update() {
      // this.scaleX = this.scaleY = 0.95 + Math.sin(this.frame / 10) * 0.05;
      this.scaleX = this.scaleY = clamp(0, 1, this.frame / 80);
      this.advance();
    },
    draw() {
      if (this.frame < 2) return;
      const { context: ctx } = this;

      if (this.frame > 80 && this.frame < 200) {
        ctx.save();
        // ctx.filter = `blur(${(this.frame - 80) / 10}px)`;
        ctx.globalAlpha = 1 - ((this.frame - 80) / 120);
        const scale = 1 + ((this.frame - 80) / 10) * 0.05;
        ctx.translate(128, 50);
        ctx.scale(scale, scale);
        ctx.translate(-128, -50);
        ctx.drawImage(this.image, 0, 0);
        ctx.restore();
      }

      ctx.drawImage(this.image, 0, 0);
    },
  });

  const shineEffect = gameObject({
    x: 0,
    y: 72,
    anchor: { x: 0.5, y: 0.5 },
    width: 30,
    height: 200,
    ttl: Infinity,
    dx: 5,
    limit: 1000 * rnd(1, 2),
    update() {
      this.x > this.limit && (this.x = 0, this.limit = 1000 * rnd(1, 2));
      this.advance();
    },
    draw() {
      const { context: ctx } = this;
      ctx.save();
      ctx.globalCompositeOperation = 'source-atop';
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = 'white';
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-10, 0, 5, this.height);
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillRect(40, 0, 10, this.height);
      ctx.restore();
    },
  });

  const randomShip = gameObject({
    x: 128,
    y: 256,
    anchor: { x: 0.5, y: 0.5 },
    width: 8,
    height: 8,
    image: imageAssets['spritesheet.png'],
    sprite: 4,
    dy: -0.5,
    spawn() {
      this.x = rnd(0, 256);
      this.y = 256;
      this.dy = -rnd(0.5, 1.5);
      this.sprite = Math.floor(rnd(3, 9));
    },
    update() {
      this.y < -8 && (this.y = -8, delay(() => this.spawn(), rnd(1000, 2000)));
      this.advance();
    },
    draw() {
      const { context: ctx } = this;
      ctx.save();
      ctx.drawImage(this.image, this.sprite * 8, 0, 8, 8, 0, 0, 8, 8);
      ctx.restore();
    },
  });

  const saturn = gameObject({
    x: 128 + 96,
    y: 256 + 120,
    anchor: { x: 0.5, y: 0.5 },
    width: 256,
    height: 240,
    image: imageAssets['saturn.png'],
    dy: -0.7,
    update() {
      this.y < 240 && (this.dy = 0);
      this.advance();
    },
    draw() {
      const { context: ctx } = this;
      ctx.save();
      // ctx.globalAlpha = 0.5;
      ctx.drawImage(this.image, 0, 0, 256, 240);
      ctx.restore();
    },
  });

  const editionText = text({
    x: 128,
    y: 120,
    text: 'DIRECTORS CUT EDITION',
    align: 'center',
    color: 'lightblue',
  });

  const hiscoreText = text({
    x: 128,
    y: 128 + 16,
    text: 'HI SCORE: 0',
    align: 'center',
    color: 'green',
    colorIndex: 0,
    update() {
      const colors = ['red', 'yellow', 'white', 'green', 'lightblue', 'lightgreen'];
      this.frame % 40 === 0 && (this.colorIndex++, this.colorIndex > 5 && (this.colorIndex = 0));
      this.color = colors[this.colorIndex];
      const fontName = this.color ? `font-${this.color}.png` : 'font.png';
      this.spritesheet = imageAssets[fontName];
      this.advance();
      // console.log(this.color, this.frame);
    }
  });

  text({
    x: 128,
    y: 128,
    text: 'A GAME BY\nMARCO FERNANDES',
    lineHeight: 16,
    color: 'white',
    align: 'center',
  });

  const controlsText = text({
    x: 128,
    y: 128 + 40,
    text: 'ARROWS OR WASD TO MOVE\nSPACE TO SHOOT',
    lineHeight: 16,
    align: 'center',
  });

  const startText = text({
    x: 128,
    y: 240 - 32,
    text: 'ENTER TO START',
    color: 'lightgreen',
    align: 'center',
  });

  hiscoreText.text = `HIGH SCORE: ${localStorage.getItem('hiscore') || 0}`;

  const creditsText = text({
    x: 256,
    y: 240 - 12,
    text: 'GAME BY MARCO FERNANDES @ GRAPHICS BY KENNEY.NL @ MUSIC: START SCREEN BY DEPP @ GAME BY JUKEBOX @ GAME OVER BY DEPP @ SOUND EFFECTS ZAPSPLAT.COM @ GREETINGS TO STEVEN LAMBERT, KONTRAJS IS THE BEST! FRANK FORCE, ZZFX FTW!1!! ANDRZEJ MAZUR, MR. JS13K!. @@@ THANKS FOR PLAYING!',
    color: 'yellow',
    align: 'lef',
    dx: -0.5,
    update() {
      this.x < -this.text.length * 8 && (this.x = 256);
      this.advance();
    },
  });

  const s = scene({
    frame: 0,
    children: [
      starPool,
      saturn,
      randomShip,
      startText,
      creditsText,
    ],
    update() {
      this.frame > 40 && this.frame < 180 && this.frame % 20 === 0 && starPool.decreaseVel(2);
      this.frame++;
    }
  });

  delay(() => {
    s.add(title);
    s.add(shineEffect);
    zzfxP(dataAssets['engineSlowdown']);
  }, 100);

  // delay(() => {
  //   s.add(saturn);
  // }, 600);

  delay(() => {
    s.add(editionText);
  }, 2500);

  delay(() => {
    s.add(hiscoreText);
  }, 3000);

  // delay(() => {
  //   s.add(gameByText);
  // }, 3000);

  delay(() => {
    s.add(controlsText);
  }, 3500);

  return s;
}

function gameOverScene(
  {
    score = 0,
    previous = localStorage.getItem('hiScore') || 0
  } = {}
) {
  onKey(['enter'], () => {
    emit('change-scene', 'menu');
  });

  on('explosion', (x, y, volume, magnitude, color) => {
    zzfxP(dataAssets['explosion']);

    for (let i = 0; i < volume; i++) {
      explosionPool.get({
        x,
        y,
        dx: rnd(- magnitude / 2, magnitude / 2),
        dy: rnd(- magnitude / 2, magnitude / 2),
        color,
        ttl: 30 * magnitude,
      });
    }
  });

  const starPool = starfield(1);

  const explosionPool = pool({
    create: explosionParticle,
    maxSize: 400,
  });

  const title = gameObject({
    x: 128,
    y: 48,
    anchor: { x: 0.5, y: 0.5 },
    width: 256,
    height: 100,
    scaleX: 0.01,
    scaleY: 0.01,
    image: imageAssets['gameover.png'],
    update() {
      // this.scaleX = this.scaleY = 0.95 + Math.sin(this.frame / 10) * 0.05;
      this.scaleX = this.scaleY = clamp(0, 1, this.frame / 200);
      this.advance();
    },
    draw() {
      if (this.frame < 2) return;
      const { context: ctx } = this;
      ctx.drawImage(this.image, 0, 0);
    },
  });

  text({
    x: 128,
    y: 32,
    text: 'GAME OVER',
    align: 'center',
    color: 'red',
    scaleX: 2,
    scaleY: 4,
  });

  const scoreLabelText = text({
    x: 128,
    y: 128,
    text: 'YOUR SCORE:',
    color: 'white',
    align: 'center',
  });

  const scoreText = text({
    x: 128,
    y: 144,
    text: `${score}`,
    color: 'white',
    align: 'center',
    scaleX: 2,
    scaleY: 2,
  });

  const hiscoreText = text({
    x: 128,
    y: 180,
    text: 'NEW HIGH SCORE!',
    color: 'yellow',
    align: 'center',
  });

  const startText = text({
    x: 128,
    y: 240 - 16,
    text: 'ENTER TO CONTINUE',
    color: 'lightgreen',
    align: 'center',
  });

  const s = scene({
    frame: 0,
    children: [
      starPool,
      startText,
      explosionPool,
    ],
    // update() {
    //   this.frame > 40 && this.frame < 140 && this.frame % 20 === 0 && starPool.decreaseVel(2);
    //   this.frame++;
    // }
  });

  delay(() => {
    s.add(title);
    // emit('explosion', 128, 48, 100, 6, 'red');
  }, 1000);

  delay(() => {
    s.add(scoreLabelText);
  }, 2000);

  delay(() => {
    s.add(scoreText);
  }, 2500);

  if (score > previous) {
    delay(() => {
      s.add(hiscoreText);
      emit('explosion', 128, 180, 60, 4, 'yellow');
    }, 3000);
  }

  return s;
}

var zzfxm = (n,f,t,e=125)=>{let l,o,z,r,g,h,x,a,u,c,i,m,p,G,M=0,R=[],b=[],j=[],k=0,q=0,s=1,v={},w=zzfxR/e*60>>2;for(;s;k++)R=[s=a=m=0],t.map((e,d)=>{for(x=f[e][k]||[0,0,0],s|=!!f[e][k],G=m+(f[e][0].length-2-!a)*w,p=d==t.length-1,o=2,r=m;o<x.length+p;a=++o){for(g=x[o],u=o==x.length+p-1&&p||c!=(x[0]||0)|g|0,z=0;z<w&&a;z++>w-99&&u?i+=(i<1)/99:0)h=(1-i)*R[M++]/2||0,b[r]=(b[r]||0)-h*q+h,j[r]=(j[r++]||0)+h*q+h;g&&(i=g%1,q=x[1]||0,(g|=0)&&(R=v[[c=x[M=0]||0,g]]=v[[c,g]]||(l=[...n[c]],l[2]*=2**((g-12)/12),g>0?zzfxG(...l):[])));}m=G;});return [b,j]};

var song1 = [[[, 0, 77, , , .7, 2, .41, , , , , , , , .06], [, 0, 43, .01, , .3, 2, , , , , , , , , .02, .01], [, 0, 170, .003, , .008, , .97, -35, 53, , , , , , .1], [.8, 0, 270, , , .12, 3, 1.65, -2, , , , , 4.5, , .02], [, 0, 86, , , , , .7, , , , .5, , 6.7, 1, .05], [, 0, 41, , .05, .4, 2, 0, , , 9, .01, , , , .08, .02], [, 0, 2200, , , .04, 3, 2, , , 800, .02, , 4.8, , .01, .1], [.3, 0, 16, , , .3, 3]], [[[1, -1, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33], [3, 1, 22, , , , , , , , , , , , , , , , , , , , , , , , , , , , 24, , , , 24, , , , , , , , , , , , , , , , , , , , , , , , 22, , 22, , 22, , , ,], [5, -1, 21, , , , , , , , , , , , , , , , , , , , , , , , , , , , 24, , , , 23, , , , , , , , , , , , , , , , , , , , , , , , 24, , 23, , 21, , , ,], [, 1, 21, , , , , , , , , , , , , , , , , , , , , , , , , , , , 24, , , , 23, , , , , , , , , , , , , , , , , , , , , , , , 24, , 23, , 21, , , ,]], [[1, -1, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33], [3, 1, 24, , , , , , , , 27, , , , , , , , , , , , , , , , 27, , , , 24, , , , 24, , , , , , , , 27, , , , , , , , , , , , , , , , 24, , 24, , 24, , , ,], [5, -1, 21, , , , , , , , , , , , , , , , , , , , , , , , , , , , 24, , , , 23, , , , , , , , , , , , , , , , , , , , , , , , 24, , 23, , 21, , , ,], [, 1, 21, , , , , , , , , , , , , , , , , , , , , , , , , , , , 24, , , , 23, , , , , , , , , , , , , , , , , , , , , , , , 24, , 23, , 21, , , ,], [6, 1, , , 34, 34, 34, , , , , , 34, 34, , , , , 34, , , , 34, 34, , , , , 34, , , , 34, , , , 34, 34, 34, , , , , , 34, , , , , , 34, 34, , , 34, 34, , , , , , , , , 34, 34], [4, 1, , , , , , , 24, , , , , , 24, , 24, , , , 24, , , , 24, , , , , , , , , , , , , , , , 24, , , , , , 24, , 24, , , , 24, , , , 24, , , , , , , , , ,]], [[1, -1, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 23, 23, 35, 23, 23, 36, 23, 23, 35, 23, 23, 36, 23, 23, 35, 35, 23, 23, 35, 23, 23, 35, 23, 23, 36, 23, 23, 35, 23, 23, 36, 36], [5, -1, 21, , , 19, , , 21, , , , , , , , , , 21, , , 19, , , 17, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,], [3, 1, 24, , , 24, , , 24, , , , , , , , , , 24, , , 24, , , 24, , , , 24.75, 24.5, 24.26, 24.01, 24.01, 24.01, , , , , 25, , , , , , , , 25, , , , , , , , 25, , , , , , , , 25, 25, 25, 25], [4, -1, , , , , , , , , , , , , , , , , , , , , , , , , , , 24.75, 24.5, 24.26, 24.01, 24.01, 24.01, 24.01, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 24, , 24, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 24, 24], [7, -1, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 23, , 21, 23, , 35, , 23, , 21, 23, , 35, , 35, , 23, , 21, 23, , 35, , 21, 23, , 35, , 21, 23, , ,], [6, 1, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 34, 36, 34, , 33, 34, 34, 36, 31, 36, 34, , 31, 34, 32, , 33, 36, 34, , 31, 34, 34, 36, 33, 36, 33, , 31, , ,]], [[1, -1, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 17, 17, 29, 17, 17, 29, 17, 17, 29, 17, 17, 29, 17, 17, 29, 29, 17, 17, 29, 17, 17, 29, 17, 17, 29, 17, 17, 29, 17, 17, 29, 29], [4, 1, 24, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 24, , 24, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 24, 24, 24, , , 24, 24, , 24, , 24, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 24, 24], [7, -1, 21, , 19, 21, , 33, , 21, , 19, 21, , 33, , 33, , 21, , 19, 21, , 33, , 21, , 19, 21, , 33, , 33, , 17, , 17, 17, 29, 17, 17, 29, 17, , 17, 17, 29, 17, 17, 29, 17, , 17, 17, 29, 17, 17, 29, 17, , 17, 17, 29, 17, 17, 29], [2, 1, , 34, 34, 34, , 34, 34, 34, , 34, 34, 34, , 34, 34, 34, , 34, 34, 34, , 34, 34, 34, , 34, 34, 34, , 34, , , , 34, 34, 34, , 34, 34, 34, , 34, 34, 34, , 34, 34, 34, , 34, 34, 34, , 34, 34, 34, , 34, 34, 34, , 34, , ,], [6, 1, , , 36, , , , , , 36, , 36, , , , , , , , 36, , , , , , 36, , 36, , , , , , , , 36, , , , , , , , , , , , , , , , 36, , , , , , 36, , 36, , , , , ,], [3, 1, , , , , 25, , , , , , , , 25, , , , , , , , 25, , , , , , , , 25, 25, 25, 25, , , , , 25, , , , , 25, , , 25, , , , , , , , 25, , , , , , , , 25, 25, 25, 25]], [[1, -1, 14, 14, 26, 14, 14, 26, 14, 14, 26, 14, 14, 26, 14, 14, 26, 26, 14, 14, 26, 14, 14, 26, 14, 14, 26, 14, 14, 26, 14, 14, 26, 26, 17, 17, 29, 17, 17, 29, 17, 17, 29, 17, 17, 29, 17, 17, 29, 29, 19, 19, 31, 19, 19, 31, 19, 19, 31, 19, 19, 31, 19, 19, 31, 31], [4, 1, 24, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 24, , 24, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 36, , 24, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 24, 24], [7, -1, 14, , 14, 14, 26, 14, 14, 26, 14, , 14, 14, 26, 14, 14, 26, 14, , 14, 14, 26, 14, 14, 26, 14, , 14, 14, 26, 14, 14, 26, 17, , 17, 17, 29, 17, 17, 29, 17, , 17, 17, 29, 17, 17, 29, 19, , 19, 19, 31, 19, 19, 31, 19, , 19, 19, 31, 19, 19, 31], [2, 1, , 36, 36, 36, , 36, 36, 36, , 36, 36, 36, , 36, 36, 36, , 36, 36, 36, , 36, 36, 36, , 36, 36, 36, , 36, , , , 36, 36, 36, , 36, 36, 36, , 36, 36, 36, , 36, 36, 36, , 36, 36, 36, , 36, 36, 36, , 36, 36, 36, , 36, , ,], [3, 1, , , , , 25, , , , , , , , 25, , , , , , , , 25, , , , , , , , 25, 25, 25, 25, , , , , 25, , , , , , , , 25, , , , , , , , 25, , , , , , , , 25, 25, 25, 25], [6, 1, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 34, , , , , , 34, , 34, , , , , , , , 34, , , , , , 34, , 34, , , , , ,]]], [0, 1, 1, 2, 3, 4, 4]];

var explosion = [, , 45, .03, .21, .6, 4, .9, 2, -3, , , , .2, , .9, , .45, .26];

var shoot = [.9, , 413, , .05, .01, 1, 3.8, -3, -13.4, , , , , , , .11, .65, .07, , 237];

var typing = [1.5,,261,.01,.02,.08,1,1.5,-0.5,,,-0.5,,,,,.9,.05];

var powerup = [1.6,,291,.01,.21,.35,,2.2,,,-136,.09,.03,,,.2,.2,.7,.28];

var transition = [,,468,.05,.62,.7,,.3,,,300,.05,.02,,,,.32,,.6];

var shoot2 = [.8,,112,.03,.1,.2,3,3.6,18,-9,,,,,,,.03,.83,.12];

var hit = [2.3, , 330, , .06, .17, 2, 3.7, , , , , .05, .4, 2, .5, .13, .89, .05, .17];

var bigExplosion = [,,73,.02,.06,.96,4,.1,5.6,-7.4,,,.37,2.6,,.3,.3,.8,.16];

var engineSlowdown = [,,250,.13,.25,.83,1,.7,,-0.3,,,,,17,,,,.02,,23];

function loadingScene() {
  onKey(['enter'], () => {
    emit('change-scene', 'menu');
  });

  const loadingText = text({
    x: 128,
    y: 120,
    text: 'LOADING',
    color: 'lightgreen',
    align: 'center',
  });

  delay(async () => {
    loadingText.text = 'PRESS ENTER TO CONTINUE';
    // emit('change-scene', 'menu');
  },1000);

  return scene({
    id: 'loading',
    frame: 0,
    children: [loadingText],
  });
}

var dither = {
	// NES palette.
	palette: [
		[124, 124 ,124],
		[0, 0 ,252],
		[0, 0 ,188],
		[68, 40 ,188],
		[148, 0 ,132],
		[168, 0 ,32],
		[168, 16 ,0],
		[136, 20 ,0],
		[80, 48 ,0],
		[0, 120 ,0],
		[0, 104 ,0],
		[0, 88 ,0],
		[0, 64 ,88],
		[0, 0, 0],
		[188, 188 ,188],
		[0, 120 ,248],
		[0, 88 ,248],
		[104, 68 ,252],
		[216, 0 ,204],
		[228, 0 ,88],
		[248, 56 ,0],
		[228, 92 ,16],
		[172, 124 ,0],
		[0, 184 ,0],
		[0, 168 ,0],
		[0, 168 ,68],
		[0, 136 ,136],
		[248, 248 ,248],
		[60, 188 ,252],
		[104, 136 ,252],
		[152, 120 ,248],
		[248, 120 ,248],
		[248, 88 ,152],
		[248, 120 ,88],
		[252, 160 ,68],
		[248, 184 ,0],
		[88, 216 ,84],
		[88, 248 ,152],
		[0, 232 ,216],
		[120, 120 ,120],
		[252, 252 ,252],
		[164, 228 ,252],
		[184, 184 ,248],
		[216, 184 ,248],
		[248, 184 ,248],
		[248, 164 ,192],
		[240, 208 ,176],
		[252, 224 ,168],
		[248, 216 ,120],
		[216, 248 ,120],
		[184, 248 ,184],
		[184, 248 ,216],
		[0, 252 ,252],
		[216, 216 ,216],
	],
	
	step: 1,
	
	/**
	* Perform an error diffusion dither on the image
	* */
	errorDiffusionDither: function(in_imgdata, w, h) {
		// Create a new empty image
		// var out_imgdata = $.ctx.createImageData(in_imgdata);
		var d = new Uint8ClampedArray(in_imgdata.data);
		var out = new Uint8ClampedArray(in_imgdata.data);
		// Step
		var step = this.step;
		// Ratio >=1
		var ratio = 1/16;
		// Threshold Matrix
		new Array(
			[  1,  9,  3, 11 ],
			[ 13,  5, 15,  7 ],
			[  4, 12,  2, 10 ],
			[ 16,  8, 14,  6 ]
		);

		// var w = width;
		// var h = height;
	
		for (var y=0;y<h;y += step) {
			for (var x=0;x<w;x += step) {
				var i = (4*x) + (4*y*w);
				
				var $i = function(x,y) {
					return (4*x) + (4*y*w);
				};
	
				// Define bytes
				var r = i;
				var g = i+1;
				var b = i+2;
	
				var color = new Array(d[r],d[g],d[b]); 
				var approx = this.approximateColor(color);
				
				var q = [];
				q[r] = d[r] - approx[0];
				q[g] = d[g] - approx[1];
				q[b] = d[b] - approx[2];
									
				// Diffuse the error
				d[$i(x+step,y)] =  d[$i(x+step,y)] + 7 * ratio * q[r];
				d[$i(x-step,y+1)] =  d[$i(x-1,y+step)] + 3 * ratio * q[r];
				d[$i(x,y+step)] =  d[$i(x,y+step)] + 5 * ratio * q[r];
				d[$i(x+step,y+step)] =  d[$i(x+1,y+step)] + 1 * ratio * q[r];
	
				d[$i(x+step,y)+1] =  d[$i(x+step,y)+1] + 7 * ratio * q[g];
				d[$i(x-step,y+step)+1] =  d[$i(x-step,y+step)+1] + 3 * ratio * q[g];
				d[$i(x,y+step)+1] =  d[$i(x,y+step)+1] + 5 * ratio * q[g];
				d[$i(x+step,y+step)+1] =  d[$i(x+step,y+step)+1] + 1 * ratio * q[g];
	
				d[$i(x+step,y)+2] =  d[$i(x+step,y)+2] + 7 * ratio * q[b];
				d[$i(x-step,y+step)+2] =  d[$i(x-step,y+step)+2] + 3 * ratio * q[b];
				d[$i(x,y+step)+2] =  d[$i(x,y+step)+2] + 5 * ratio * q[b];
				d[$i(x+step,y+step)+2] =  d[$i(x+step,y+step)+2] + 1 * ratio * q[b];
	
				// Color
				var tr = approx[0];
				var tg = approx[1];
				var tb = approx[2];
	
				// Draw a block
				for (var dx=0;dx<step;dx++){
					for (var dy=0;dy<step;dy++){
						var di = i + (4 * dx) + (4 * w * dy);
	
						// Draw pixel
						out[di] = tr;
						out[di+1] = tg;
						out[di+2] = tb;
	
					}
				}
			}
		}
		// out_imgdata.data.set(out);
		// return out_imgdata;
		return out;
	},
	/**
	* Perform an ordered dither on the image
	* */
	dither: function(in_imgdata, w, h) {
    // Create a new empty image
    // var canvas = document.createElement('canvas');
    // canvas.width = 512;
    // canvas.height = 480;
    // var ctx = canvas.getContext('2d');
		// var out_imgdata = ctx.createImageData(in_imgdata);
		var d = new Uint8ClampedArray(in_imgdata.data);
		// Step
		var step = 1; //this.step;
		// Ratio >=1
		var ratio = 2;
		// Threshold Matrix
		var m = new Array(
			[  1,  9,  3, 11 ],
			[ 13,  5, 15,  7 ],
			[  4, 12,  2, 10 ],
			[ 16,  8, 14,  6 ]
		);
		
		// var w = 512;
		// var h = 480;
	
		for (var y=0;y<h;y += step) {
			for (var x=0;x<w;x += step) {
				var i = (4*x) + (4*y*w);
	
				// Define bytes
				var r = i;
				var g = i+1;
				var b = i+2;
	
				d[r] += m[x%4][y%4] * ratio; 
				d[g] += m[x%4][y%4] * ratio; 
				d[b] += m[x%4][y%4] * ratio; 
	
				//var tr = threshold(d[r]);
				//var tg = threshold(d[g]);
				//var tb = threshold(d[b]);
				var color = new Array(d[r],d[g],d[b]); 
				var approx = this.approximateColor(color);
				var tr = approx[0];
				var tg = approx[1];
				var tb = approx[2];
	
				// d[r] = t;
				// d[g] = t;
				// d[b] = t;
	
				// Draw a block
				for (var dx=0;dx<step;dx++){
					for (var dy=0;dy<step;dy++){
						var di = i + (4 * dx) + (4 * w * dy);
	
						// Draw pixel
						d[di] = tr;
						d[di+1] = tg;
						d[di+2] = tb;
	
					}
				}
			}
		}
		// out_imgdata.data.set(d);
		return d; // out_imgdata;
	},
	
	/**
	* Return the most closer color vs a common palette
	* @param array - the color
	* @return i - the index of the coloser color
	* */
	approximateColor: function(color) {
		var palette = this.palette;
		var findIndex = function(fun,arg,list,min) {
			if (list.length == 2) {
				if (fun(arg,min) <= fun(arg,list[1])) {
					return min;
				}else {
					return list[1];
				}
			} else {
				//var hd = list[0];
				var tl = list.slice(1);
				if (fun(arg,min) <= fun(arg,list[1])) {
					min = min; 
				} else {
					min = list[1];
				}
				return findIndex(fun,arg,tl,min);
			}
		};
		var found_color = findIndex(this.colorDistance,color,palette,palette[0]);
		return found_color;
	},
	
	/**
	* Return a distance of two colors ina three dimensional space
	* @param array
	* @param array
	* @return number
	* */
	colorDistance: function(a,b) {
		//if (a == null) return b;
		//if (b == null) return a;
		return Math.sqrt( 
			Math.pow( ((a[0]) - (b[0])),2 )
			+ Math.pow( ((a[1]) - (b[1])),2 ) 
			+ Math.pow( ((a[2]) - (b[2])),2 )
		);
	},
};

class ImageGeneration {
  constructor(props) {
    this.canvas = document.createElement('canvas');
    // this.canvas = document.getElementById('c2');
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.ctx.imageSmoothingEnabled = false;
    this.image = new Image();
    Object.assign(this, props);
  }

  async generate(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;

    this.draw && await this.draw(this.ctx);

    const data = this.ctx.getImageData(0, 0, width, height);
    const dithered = new ImageData(
      dither.dither(data, width, height),
      width,
      height,
    );
    this.ctx.putImageData(dithered, 0, 0);
    this.image.src = this.canvas.toDataURL();

    return new Promise((resolve) => {
      this.image.onload = () => resolve(this.image);
    });
    // return this.canvas.toDataURL();
  }
}

function imageGeneration(props) {
  return new ImageGeneration(props);
}

var title = () => imageGeneration({
  draw(ctx) {
    const path = new Path2D('M42.125 56V47.7188H52.375V38.875H42.125V31.6562H52.375V22.8125H42.125V14.5312H58.1562L66.4688 22.8125V31.25L62.3125 35.4062L66.4688 39.5625V47.7188L58.1562 56H42.125ZM26.125 56V14.5312H39.9375V56H26.125ZM72.875 56V14.5312H86.6875V56H72.875ZM88.875 56V47.7188H95.7188V42.4688H108.25V56H88.875ZM113.5 56V47.1562H117.656V23.3438H113.5V14.5312H135.625V23.3438H131.469V47.1562H135.625V56H113.5ZM167.375 56L142.25 14.5312H156.844L182.062 56H167.375ZM182.062 52.0625L170.031 32.25V14.5312H182.062V52.0625ZM142.25 56V18.4688L154.281 38.1875V56H142.25ZM204.75 56V47.7188H215V22.8125H204.75V14.5312H220.531L228.844 22.8125V47.7188L220.531 56H204.75ZM188.75 56V14.5312H202.562V56H188.75ZM40.4062 111V69.5312H54.2188V88.0625H66.9688V96.2188H54.2188V111H40.4062ZM63.6562 83.2812V77.8125H56.4062V69.5312H77.4688V83.2812H63.6562ZM83.5312 111V69.5312H97.3438V85.9688H110.562V93.9688H97.3438V111H83.5312ZM108.125 81.5312V77.5625H99.5312V69.5312H121.125V81.5312H108.125ZM99.5312 111V102.719H107.312V98.5625H121.125V111H99.5312ZM156.812 111L155.062 106.469H141.5L144.375 98.25H151.875L140.781 69.5312H154.25L170.781 111H156.812ZM124.469 111L139.281 71.4062L145.406 87.875L137.812 111H124.469ZM190.469 98.5625V90.5312H200.844V77.8125H190.469V69.5312H206.25L214.562 77.8125V90.25L208.125 96.6875L215.969 111H201.219L195.344 98.5625H190.469ZM174.469 111V69.5312H188.281V111H174.469Z');
    ctx.fillStyle = 'white';
    ctx.fill(path);
    ctx.globalCompositeOperation = 'source-in';

    const gradient = ctx.createLinearGradient(0, 20, 0, 80);
    gradient.addColorStop(0, 'rgb(255, 255, 255, 1)');
    gradient.addColorStop(0.21, 'rgb(0, 255, 255, 1)');
    gradient.addColorStop(1, 'rgb(0, 0, 255, 1)');
  
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 240);
  
    ctx.globalCompositeOperation = 'source-over';

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.stroke(path);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke(path);
  },
});

var gameOver = () => imageGeneration({
  draw(ctx) {
    ctx.save();
    ctx.translate(0, -100);
    const path = new Path2D('M42 166L33.7188 157.719V132.812L42 124.531H47.5312V157.719H59.375V166H42ZM60 136.969V132.812H49.7188V124.531H66.5625L73.8125 132.812V136.969H60ZM61.5625 166V151.219H54.8438V143H73.8125V166H61.5625ZM109.5 166L107.75 161.469H94.1875L97.0625 153.25H104.562L93.4688 124.531H106.938L123.469 166H109.5ZM77.1562 166L91.9688 126.406L98.0938 142.875L90.5 166H77.1562ZM151.781 166L127.188 124.531H141.875L153 142.969L161.75 127.969V148.844L151.781 166ZM163.781 166V124.531H177.594V166H163.781ZM127.156 166V128.375L140.062 150.031V166H127.156ZM184.281 166V124.531H198.094V140.969H211.312V148.969H198.094V166H184.281ZM208.875 136.531V132.562H200.281V124.531H221.875V136.531H208.875ZM200.281 166V157.719H208.062V153.562H221.875V166H200.281ZM61.5 221V212.562H66.7812V187.938H61.5V179.531H72.2188L80.5938 187.812V212.719L72.2188 221H61.5ZM48.6875 221L40.2812 212.719V187.812L48.6875 179.531H59.3125V187.938H54.125V212.562H59.3125V221H48.6875ZM97.7188 221L82.7188 179.531H96.8125L111.156 221H97.7188ZM112.844 219.75L106.625 201.5L113.312 179.531H127.188L112.844 219.75ZM130.625 221V179.531H144.438V195.969H157.656V203.969H144.438V221H130.625ZM155.219 191.531V187.562H146.625V179.531H168.219V191.531H155.219ZM146.625 221V212.719H154.406V208.562H168.219V221H146.625ZM190.625 208.562V200.531H201V187.812H190.625V179.531H206.406L214.719 187.812V200.25L208.281 206.688L216.125 221H201.375L195.5 208.562H190.625ZM174.625 221V179.531H188.438V221H174.625Z');
    ctx.fillStyle = 'white';
    ctx.fill(path);
    ctx.restore();
    ctx.globalCompositeOperation = 'source-in';

    const gradient = ctx.createLinearGradient(0, 20, 0, 120);
    gradient.addColorStop(0, 'rgb(255, 255, 255, 1)');
    gradient.addColorStop(0.31, 'rgb(255, 255, 0, 1)');
    gradient.addColorStop(0.71, 'rgb(172, 124 ,0, 1)');
    gradient.addColorStop(1, 'rgb(248, 56 ,0, 1)');
  
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 240);
  
    ctx.globalCompositeOperation = 'source-over';

    ctx.save();
    ctx.translate(0, -100);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.stroke(path);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke(path);
    ctx.restore();
  },
});

var saturn = async () => {
  const imgData = `
    <svg width="200" height="144" viewBox="0 0 200 144" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M142.301 99.9813C158.007 76.187 151.45 44.1656 127.656 28.4595C103.862 12.7534 71.8401 19.3102 56.134 43.1046C40.4279 66.8989 46.9848 98.9202 70.7792 114.627C94.5734 130.333 126.595 123.775 142.301 99.9813Z" fill="#E5B883"/>
    <path d="M142.301 99.9813C158.007 76.187 151.45 44.1656 127.656 28.4595C103.862 12.7534 71.8401 19.3102 56.134 43.1046C40.4279 66.8989 46.9848 98.9202 70.7792 114.627C94.5734 130.333 126.595 123.775 142.301 99.9813Z" fill="#E5B883"/>
    <path opacity="0.41" d="M81.7066 89.9633C71.4796 91.0997 61.7398 91.9113 51.9998 92.3983C55.7334 100.839 61.5773 107.982 68.8823 113.339C83.33 117.073 100.05 118.047 105.407 111.391C98.427 111.229 91.1219 110.417 84.6285 107.496C89.6609 109.443 107.842 108.794 111.414 104.411C109.952 104.249 108.654 103.761 107.193 103.599C116.77 101.976 140.309 101.489 145.827 92.723C140.146 92.0736 134.627 96.2947 129.432 93.21C134.302 90.1257 141.607 89.9633 148.263 88.6647C149.074 86.5544 149.562 84.2818 150.048 82.009C134.79 85.2557 117.907 96.7814 104.108 90.775C110.439 87.6907 120.017 89.4763 124.887 83.47C118.231 82.1714 110.115 87.2037 103.459 89.1517C93.0698 92.0736 80.7326 95.8071 70.0187 94.9959C73.5899 94.1838 78.9469 92.3983 81.7066 89.9633Z" fill="#AC2024"/>
    <path opacity="0.41" d="M50.5374 54.4124C50.375 54.7371 50.375 55.0618 50.2127 55.3864C57.193 53.9254 66.6083 48.2438 73.751 46.1335C83.8156 43.3737 93.5552 44.0232 103.783 43.2114C98.2629 43.5361 93.8806 47.1075 89.1725 49.3801C95.3407 50.3541 101.835 47.1075 107.678 45.3218C118.068 42.0751 128.781 38.6661 137.548 36.8805C136.736 36.0688 135.924 35.2572 135.112 34.4455C119.529 33.1469 104.107 34.1209 88.3609 35.7442C72.4523 37.3675 63.5239 48.2438 50.5374 54.4124Z" fill="#AC2024"/>
    <path opacity="0.41" d="M48.5897 81.6844C54.9207 81.3597 64.9853 77.4637 68.719 76.9767C73.7512 76.1651 79.7576 75.5157 85.6015 75.5157C87.5496 76.1651 89.8222 76.4897 91.6078 76.4897C92.7441 76.4897 93.8807 76.3274 94.8542 76.1651C95.1796 76.1651 95.5041 76.3274 95.9908 76.3274L95.0164 76.1651C102.322 75.1911 109.627 72.2691 116.12 69.5094C126.185 65.4511 139.009 63.1785 149.073 57.8215C148.911 57.0098 148.587 56.3605 148.424 55.7112C135.6 61.3929 122.614 66.1004 109.139 70.3211C104.594 71.7821 96.8029 75.6781 91.1208 75.3534L88.5235 74.8664C75.3746 69.5095 95.8285 59.7695 97.1274 68.2108C96.153 65.6135 88.5235 67.5615 90.3092 72.2691C94.6919 71.9445 101.51 70.6458 103.621 66.4251C97.9385 63.6655 85.7639 58.9579 81.2185 66.1005C79.1082 69.3472 80.0822 71.9445 82.0302 73.7301C71.8032 73.8924 57.8427 73.7301 48.1027 78.4377C48.2651 79.4117 48.4274 80.2234 48.5897 81.1974C48.4274 81.1974 48.4274 81.3597 48.5897 81.6844Z" fill="#AC2024"/>
    <path opacity="0.82" d="M65.3105 37.0428C64.0119 37.3675 61.9015 37.8546 59.4666 38.5039C57.0315 41.4258 54.9212 44.5101 53.2979 47.9191C56.7069 46.4581 59.9536 44.8348 60.9276 44.3478C67.7456 40.9388 75.3751 37.3675 83.0048 35.2572C93.8807 32.3352 104.919 33.7962 115.796 32.1729C112.225 30.5496 106.543 31.3612 103.458 29.4133C110.115 25.0302 120.503 29.0886 129.594 30.0626C126.672 27.9523 123.588 26.1665 120.179 24.7056C114.985 24.7056 110.115 25.1926 106.38 25.5172C93.7184 26.3289 82.1931 30.5496 65.3105 37.0428Z" fill="#FFEACC"/>
    <path opacity="0.82" d="M115.957 72.756C119.528 72.756 123.1 71.782 126.671 72.269C119.042 78.6 104.594 79.2493 95.0164 79.8986C80.2442 81.0349 64.1732 82.9829 49.7256 86.8788C49.7256 86.8788 49.7256 86.8788 49.7256 87.0412C66.2836 87.3658 84.6272 80.7103 101.347 82.4959C99.3996 86.5542 92.7438 87.2035 89.0101 89.9632C96.6397 93.5346 111.25 83.6322 118.555 80.7103C128.295 76.8142 140.632 73.8923 150.697 68.6977C150.534 67.2366 150.372 65.6133 150.21 63.99C138.684 66.9119 125.373 67.7236 115.957 72.756Z" fill="#FFEACC"/>
    <path opacity="0.82" d="M121.64 51.8151C119.692 58.3083 111.9 56.8473 107.193 59.2824C111.576 60.7434 116.283 57.0097 120.504 57.8213C119.205 60.9057 115.147 62.6913 112.549 65.2886C120.179 64.3147 127.321 60.4187 133.815 56.685C137.224 54.737 141.769 52.6267 146.152 50.1918C145.341 48.406 144.367 46.7827 143.392 45.1594C139.01 45.3218 134.464 45.1594 130.243 45.9711C123.588 47.1074 117.095 48.5685 110.601 50.3541C100.212 53.1137 89.9851 53.4384 79.9205 55.8734C81.5438 56.0357 83.0049 57.0097 84.4659 57.3343C77.8102 65.7756 54.272 61.555 47.6163 69.0223C47.6163 69.5093 47.6163 70.1587 47.6163 70.6457C72.4532 66.9119 96.6406 53.6007 121.64 51.8151Z" fill="#FFEACC"/>
    <path opacity="0.82" d="M125.535 109.768C120.827 109.443 108.653 114.962 105.893 118.533C112.548 121.455 137.223 108.956 139.495 102.3C133.651 101.165 118.879 107.008 113.847 110.742C115.146 111.229 115.957 110.742 117.58 110.579L125.535 109.768Z" fill="#FFEACC"/>
    <path opacity="0.23" d="M89.9848 20.8097C61.9012 25.842 43.233 52.7892 48.4277 80.8727C48.7523 82.1714 48.9147 83.47 49.4017 84.931C50.8626 86.2296 52.4859 87.366 54.2717 88.5024C72.1282 99.3782 91.4457 95.1581 107.192 82.8207C118.88 73.5677 127.483 59.4448 127.159 44.1856C126.834 33.9587 122.776 27.303 116.607 22.9201C108.166 19.998 99.075 19.1864 89.9848 20.8097Z" fill="#FFEACC"/>
    <path opacity="0.28" d="M82.1927 28.6017C61.4142 28.1147 49.7263 62.5292 66.4464 74.5418C103.945 101.489 123.1 15.2904 82.1927 28.6017Z" fill="#FFEACC"/>
    <path opacity="0.21" d="M150.048 62.3667C148.1 51.8151 143.23 42.5621 136.249 35.5818C136.411 36.2311 136.411 36.7181 136.574 37.3674C137.71 46.6204 136.574 56.3603 133.165 65.2886C122.289 93.8592 92.7441 108.793 63.5244 102.462C61.5763 101.976 58.979 101.165 56.2194 100.19C67.258 116.91 87.5496 126.325 108.49 122.592C136.411 117.398 155.08 90.4501 150.048 62.3667Z" fill="#AC2024"/>
    <path opacity="0.28" d="M150.048 62.3668C149.074 57.3345 147.613 52.7892 145.34 48.4062C143.717 54.8995 143.23 61.8798 142.255 68.3732C140.47 79.8988 135.762 85.5803 126.834 93.21C115.471 102.95 100.698 111.716 85.2771 111.716C78.6215 111.716 72.1282 109.93 65.6349 110.904C70.6672 115.124 76.5112 118.534 82.6798 120.644C88.6861 120.807 94.3674 120.32 97.2895 119.994C123.1 117.235 141.282 101.651 150.21 79.7364C151.022 74.0547 151.022 68.2108 150.048 62.3668Z" fill="#AC2024"/>
    <path opacity="0.74" d="M126.509 27.7899C128.296 28.9263 130.081 30.2249 131.704 31.5236C156.541 27.7899 175.047 30.7119 178.456 40.2895C183.65 54.8994 151.833 79.5739 107.354 95.4825C62.8751 111.391 22.6168 112.528 17.4221 97.9179C14.0132 88.3399 26.6751 74.217 48.5899 61.2304C48.9146 59.2825 49.5639 57.3344 50.0509 55.3864C16.6104 72.9184 -4.00573 93.2099 0.701911 106.683C7.03287 124.702 56.7066 123.241 111.575 103.761C166.443 84.1193 205.728 53.7631 199.234 35.7442C194.527 22.1083 164.657 19.6733 126.509 27.7899Z" fill="#FFE4CC"/>
    <path opacity="0.74" d="M106.867 94.3459C149.399 79.087 179.755 55.5488 174.56 41.9129C171.476 33.4716 155.567 30.8743 133.977 33.4716C135.438 34.7703 136.899 36.2313 138.198 37.8546C148.912 38.0169 156.379 40.452 158.327 45.4842C162.547 56.5228 137.873 75.678 103.296 88.0153C68.7195 100.515 37.3893 101.489 33.331 90.4503C31.2207 84.6063 36.74 76.8144 47.6163 68.6977C47.7786 67.0744 47.9409 65.2888 48.1033 63.6655C28.461 75.678 17.2601 88.5023 20.5067 97.268C25.7014 111.067 64.3366 109.768 106.867 94.3459Z" fill="#EDCBAE"/>
    </svg>
  `;
  const img = new Image();
  img.src = `data:image/svg+xml,${encodeURIComponent(imgData)}`;

  return new Promise((resolve) => {
    img.onload = () => {
      resolve(imageGeneration({
        draw(ctx) {
          ctx.drawImage(img, 0, 0);
        },
      }));
    };
  });
};

var font = async (color = 'white') => {
  const img = new Image();
  img.src = `font.png`;
  const colors = {
    white: ['rgb(255, 255, 255)', 'rgb(255, 255, 255)', 'rgb(63, 63, 63)'],
    yellow: ['rgb(255, 255, 255)', 'rgb(255, 255, 127)', 'rgb(255, 255, 127)', 'rgb(127, 127, 63)'],
    red: ['rgb(255, 0, 0)', 'rgb(255, 0, 0)', 'rgb(63, 0, 0)'],
    green: ['rgb(0, 127, 0)', 'rgb(0, 127, 0)', 'rgb(0, 63, 0)'],
    lightgreen: ['rgb(0, 255, 63)', 'rgb(0, 255, 63)', 'rgb(0, 63, 31)'],
    gray: ['rgb(127, 127, 127)', 'rgb(127, 127, 127)', 'rgb(63, 63, 63)'],
    lightblue: ['rgb(0, 254, 254)', 'rgb(0, 127, 127)', 'rgb(0, 63, 63)'],
  };

  return new Promise((resolve) => {
    img.onload = () => {
      resolve(imageGeneration({
        async draw(ctx) {
          ctx.drawImage(img, 0, 0);
          ctx.save();
          ctx.globalCompositeOperation = 'source-in';

          const gradient = ctx.createLinearGradient(0, 0, 0, 8);
          gradient.addColorStop(0, colors[color][0]);
          gradient.addColorStop(0.5, colors[color][1]);
          gradient.addColorStop(1, colors[color][2]);
        
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 378, 9);
          const imgData = ctx.getImageData(0, 0, 378, 9);
          const bmp = await createImageBitmap(imgData);
          ctx.globalCompositeOperation = 'source-over';
          ctx.clearRect(0, 0, 378, 9);
          for (let j = -1; j < 2; j++) {
            for (let k = -1; k < 2; k++) {
              ctx.drawImage(img, j, k);
            }
          }
          ctx.drawImage(bmp, 0, 0);
        },
      }));
    };
  });
};

/*
  (c) 2012-2021 Noora Halme et al. (see AUTHORS)

  This code is licensed under the MIT license:
  http://www.opensource.org/licenses/mit-license.php

  Fast Tracker 2 module player class

  Reading material:
  - ftp://ftp.modland.com/pub/documents/format_documentation/FastTracker%202%20v2.04%20(.xm).html
  - http://sid.ethz.ch/debian/milkytracker/milkytracker-0.90.85%2Bdfsg/resources/reference/xm-form.txt
  - ftp://ftp.modland.com/pub/documents/format_documentation/Tracker%20differences%20for%20Coders.txt
  - http://wiki.openmpt.org/Manual:_Compatible_Playback

  Greets to Guru, Alfred and CCR for their work figuring out the .xm format. :)
*/


function Fasttracker()
{
  var i, t;

  this.clearsong();
  this.initialize();

  this.playing=false;
  this.paused=false;
  this.repeat=false;

  this.filter=false;

  this.syncqueue=[];

  this.samplerate=44100;
  this.ramplen=64.0;

  this.mixval=8.0;

  // amiga period value table
  this.periodtable=new Float32Array([
  //ft -8     -7     -6     -5     -4     -3     -2     -1
  //    0      1      2      3      4      5      6      7
      907.0, 900.0, 894.0, 887.0, 881.0, 875.0, 868.0, 862.0,  // B-3
      856.0, 850.0, 844.0, 838.0, 832.0, 826.0, 820.0, 814.0,  // C-4
      808.0, 802.0, 796.0, 791.0, 785.0, 779.0, 774.0, 768.0,  // C#4
      762.0, 757.0, 752.0, 746.0, 741.0, 736.0, 730.0, 725.0,  // D-4
      720.0, 715.0, 709.0, 704.0, 699.0, 694.0, 689.0, 684.0,  // D#4
      678.0, 675.0, 670.0, 665.0, 660.0, 655.0, 651.0, 646.0,  // E-4
      640.0, 636.0, 632.0, 628.0, 623.0, 619.0, 614.0, 610.0,  // F-4
      604.0, 601.0, 597.0, 592.0, 588.0, 584.0, 580.0, 575.0,  // F#4
      570.0, 567.0, 563.0, 559.0, 555.0, 551.0, 547.0, 543.0,  // G-4
      538.0, 535.0, 532.0, 528.0, 524.0, 520.0, 516.0, 513.0,  // G#4
      508.0, 505.0, 502.0, 498.0, 494.0, 491.0, 487.0, 484.0,  // A-4
      480.0, 477.0, 474.0, 470.0, 467.0, 463.0, 460.0, 457.0,  // A#4
      453.0, 450.0, 447.0, 445.0, 442.0, 439.0, 436.0, 433.0,  // B-4
      428.0
  ]);

  this.pan=new Float32Array(32);
  this.finalpan=new Float32Array(32);
  for(i=0;i<32;i++) this.pan[i]=this.finalpan[i]=0.5;

  // calc tables for vibrato waveforms
  this.vibratotable=new Array();
  for(t=0;t<4;t++) {
    this.vibratotable[t]=new Float32Array(64);
    for(i=0;i<64;i++) {
      switch(t) {
        case 0:
          this.vibratotable[t][i]=127*Math.sin(Math.PI*2*(i/64));
          break;
        case 1:
          this.vibratotable[t][i]=127-4*i;
          break;
        case 2:
          this.vibratotable[t][i]=(i<32)?127:-127;
          break;
        case 3:
          this.vibratotable[t][i]=(1-2*Math.random())*127;
          break;
      }
    }
  }

  // volume column effect jumptable for 0x50..0xef
  this.voleffects_t0 = new Array(
    this.effect_vol_t0_f0,
    this.effect_vol_t0_60, this.effect_vol_t0_70, this.effect_vol_t0_80, this.effect_vol_t0_90, this.effect_vol_t0_a0,
    this.effect_vol_t0_b0, this.effect_vol_t0_c0, this.effect_vol_t0_d0, this.effect_vol_t0_e0
  );
  this.voleffects_t1 = new Array(
    this.effect_vol_t1_f0,
    this.effect_vol_t1_60, this.effect_vol_t1_70, this.effect_vol_t1_80, this.effect_vol_t1_90, this.effect_vol_t1_a0,
    this.effect_vol_t1_b0, this.effect_vol_t1_c0, this.effect_vol_t1_d0, this.effect_vol_t1_e0
  );

  // effect jumptables for tick 0 and ticks 1..f
  this.effects_t0 = new Array(
    this.effect_t0_0, this.effect_t0_1, this.effect_t0_2, this.effect_t0_3, this.effect_t0_4, this.effect_t0_5, this.effect_t0_6, this.effect_t0_7,
    this.effect_t0_8, this.effect_t0_9, this.effect_t0_a, this.effect_t0_b, this.effect_t0_c, this.effect_t0_d, this.effect_t0_e, this.effect_t0_f,
    this.effect_t0_g, this.effect_t0_h, this.effect_t0_i, this.effect_t0_j, this.effect_t0_k, this.effect_t0_l, this.effect_t0_m, this.effect_t0_n,
    this.effect_t0_o, this.effect_t0_p, this.effect_t0_q, this.effect_t0_r, this.effect_t0_s, this.effect_t0_t, this.effect_t0_u, this.effect_t0_v,
    this.effect_t0_w, this.effect_t0_x, this.effect_t0_y, this.effect_t0_z
  );
  this.effects_t0_e = new Array(
    this.effect_t0_e0, this.effect_t0_e1, this.effect_t0_e2, this.effect_t0_e3, this.effect_t0_e4, this.effect_t0_e5, this.effect_t0_e6, this.effect_t0_e7,
    this.effect_t0_e8, this.effect_t0_e9, this.effect_t0_ea, this.effect_t0_eb, this.effect_t0_ec, this.effect_t0_ed, this.effect_t0_ee, this.effect_t0_ef
  );
  this.effects_t1 = new Array(
    this.effect_t1_0, this.effect_t1_1, this.effect_t1_2, this.effect_t1_3, this.effect_t1_4, this.effect_t1_5, this.effect_t1_6, this.effect_t1_7,
    this.effect_t1_8, this.effect_t1_9, this.effect_t1_a, this.effect_t1_b, this.effect_t1_c, this.effect_t1_d, this.effect_t1_e, this.effect_t1_f,
    this.effect_t1_g, this.effect_t1_h, this.effect_t1_i, this.effect_t1_j, this.effect_t1_k, this.effect_t1_l, this.effect_t1_m, this.effect_t1_n,
    this.effect_t1_o, this.effect_t1_p, this.effect_t1_q, this.effect_t1_r, this.effect_t1_s, this.effect_t1_t, this.effect_t1_u, this.effect_t1_v,
    this.effect_t1_w, this.effect_t1_x, this.effect_t1_y, this.effect_t1_z
  );
  this.effects_t1_e = new Array(
    this.effect_t1_e0, this.effect_t1_e1, this.effect_t1_e2, this.effect_t1_e3, this.effect_t1_e4, this.effect_t1_e5, this.effect_t1_e6, this.effect_t1_e7,
    this.effect_t1_e8, this.effect_t1_e9, this.effect_t1_ea, this.effect_t1_eb, this.effect_t1_ec, this.effect_t1_ed, this.effect_t1_ee, this.effect_t1_ef
  );
}



// clear song data
Fasttracker.prototype.clearsong = function()
{
  var i;

  this.title="";
  this.signature="";
  this.trackerversion=0x0104;

  this.songlen=1;
  this.repeatpos=0;

  this.channels=0;
  this.patterns=0;
  this.instruments=32;

  this.amigaperiods=0;

  this.initSpeed=6;
  this.initBPM=125;

  this.patterntable=new ArrayBuffer(256);
  for(i=0;i<256;i++) this.patterntable[i]=0;

  this.pattern=new Array();
  this.instrument=new Array(this.instruments);
  for(i=0;i<32;i++) {
    this.instrument[i]=new Object();
    this.instrument[i].name="";
    this.instrument[i].samples=new Array();
  }
  
  this.chvu=new Float32Array(2);
};



// initialize all player variables to defaults prior to starting playback
Fasttracker.prototype.initialize = function()
{
  var i;
  this.syncqueue=[];

  this.tick=-1;
  this.position=0;
  this.row=0;
  this.flags=0;

  this.volume=64;
  if (this.initSpeed) this.speed=this.initSpeed;
  if (this.initBPM) this.bpm=this.initBPM;
  this.stt=0; //this.samplerate/(this.bpm*0.4);
  this.breakrow=0;
  this.patternjump=0;
  this.patterndelay=0;
  this.patternwait=0;
  this.endofsong=false;
  this.looprow=0;
  this.loopstart=0;
  this.loopcount=0;

  this.globalvolslide=0;

  this.channel=new Array();
  for(i=0;i<this.channels;i++) {
    this.channel[i]=new Object();

    this.channel[i].instrument=0;
    this.channel[i].sampleindex=0;

    this.channel[i].note=36;
    this.channel[i].command=0;
    this.channel[i].data=0;
    this.channel[i].samplepos=0;
    this.channel[i].samplespeed=0;
    this.channel[i].flags=0;
    this.channel[i].noteon=0;

    this.channel[i].volslide=0;
    this.channel[i].slidespeed=0;
    this.channel[i].slideto=0;
    this.channel[i].slidetospeed=0;
    this.channel[i].arpeggio=0;

    this.channel[i].period=640;
    this.channel[i].frequency=8363;

    this.channel[i].volume=64;
    this.channel[i].voiceperiod=0;
    this.channel[i].voicevolume=0;
    this.channel[i].finalvolume=0;

    this.channel[i].semitone=12;
    this.channel[i].vibratospeed=0;
    this.channel[i].vibratodepth=0;
    this.channel[i].vibratopos=0;
    this.channel[i].vibratowave=0;

    this.channel[i].volramp=1.0;
    this.channel[i].volrampfrom=0;

    this.channel[i].volenvpos=0;
    this.channel[i].panenvpos=0;
    this.channel[i].fadeoutpos=0;

    this.channel[i].playdir=1;

    // interpolation/ramps
    this.channel[i].volramp=0;
    this.channel[i].volrampfrom=0;
    this.channel[i].trigramp=0;
    this.channel[i].trigrampfrom=0.0;
    this.channel[i].currentsample=0.0;
    this.channel[i].lastsample=0.0;
    this.channel[i].oldfinalvolume=0.0;
  }
};



// parse the module from local buffer
Fasttracker.prototype.parse = function(buffer)
{
  var i, j, k, c, offset, datalen, hdrlen, row, ch;

  if (!buffer) return false;

  // check xm signature, type and tracker version
  for(i=0;i<17;i++) this.signature+=String.fromCharCode(buffer[i]);
  if (this.signature != "Extended Module: ") return false;
  if (buffer[37] != 0x1a) return false;
  this.signature="X.M.";
  this.trackerversion=le_word(buffer, 58);
  if (this.trackerversion < 0x0104) return false; // older versions not currently supported

  // song title
  i=0;
  while(buffer[i] && i<20) this.title+=dos2utf(buffer[17+i++]);

  offset=60;
  hdrlen=le_dword(buffer, offset);
  this.songlen=le_word(buffer, offset+4);
  this.repeatpos=le_word(buffer, offset+6);
  this.channels=le_word(buffer, offset+8);
  this.patterns=le_word(buffer, offset+10);
  this.instruments=le_word(buffer, offset+12);

  this.amigaperiods=(!le_word(buffer, offset+14))&1;

  this.initSpeed=le_word(buffer, offset+16);
  this.initBPM=le_word(buffer, offset+18);

  var maxpatt=0;
  for(i=0;i<256;i++) {
    this.patterntable[i]=buffer[offset+20+i];
    if (this.patterntable[i]>maxpatt) maxpatt=this.patterntable[i];
  }
  maxpatt++;

  // allocate arrays for pattern data
  this.pattern=new Array(maxpatt);
  this.patternlen=new Array(maxpatt);

  for(i=0;i<maxpatt;i++) {
    // initialize the pattern to defaults prior to unpacking
    this.patternlen[i]=64;
    this.pattern[i]=new Uint8Array(this.channels*this.patternlen[i]*5);
    for(row=0;row<this.patternlen[i];row++) for(ch=0;ch<this.channels;ch++) {
      this.pattern[i][row*this.channels*5 + ch*5 + 0]=255; // note (255=no note)
      this.pattern[i][row*this.channels*5 + ch*5 + 1]=0; // instrument
      this.pattern[i][row*this.channels*5 + ch*5 + 2]=255; // volume
      this.pattern[i][row*this.channels*5 + ch*5 + 3]=255; // command
      this.pattern[i][row*this.channels*5 + ch*5 + 4]=0; // parameter
    }
  }

  // load and unpack patterns
  offset+=hdrlen; // initial offset for patterns
  i=0;
  while(i<this.patterns) {
    this.patternlen[i]=le_word(buffer, offset+5);
    this.pattern[i]=new Uint8Array(this.channels*this.patternlen[i]*5);
    
    // initialize pattern to defaults prior to unpacking
    for(k=0;k<(this.patternlen[i]*this.channels);k++) {
      this.pattern[i][k*5 + 0]=0; // note
      this.pattern[i][k*5 + 1]=0; // instrument
      this.pattern[i][k*5 + 2]=0; // volume
      this.pattern[i][k*5 + 3]=0; // command
      this.pattern[i][k*5 + 4]=0; // parameter
    }    
    
    datalen=le_word(buffer, offset+7);
    offset+=le_dword(buffer, offset); // jump over header
    j=0; k=0;
    while(j<datalen) {
      c=buffer[offset+j++];
      if (c&128) {
        // first byte is a bitmask
        if (c&1) this.pattern[i][k+0]=buffer[offset+j++];
        if (c&2) this.pattern[i][k+1]=buffer[offset+j++];
        if (c&4) this.pattern[i][k+2]=buffer[offset+j++];
        if (c&8) this.pattern[i][k+3]=buffer[offset+j++];
        if (c&16) this.pattern[i][k+4]=buffer[offset+j++];
      } else {
        // first byte is note -> all columns present sequentially
        this.pattern[i][k+0]=c;
        this.pattern[i][k+1]=buffer[offset+j++];
        this.pattern[i][k+2]=buffer[offset+j++];
        this.pattern[i][k+3]=buffer[offset+j++];
        this.pattern[i][k+4]=buffer[offset+j++];
      }
      k+=5;
    }
      
    for(k=0;k<(this.patternlen[i]*this.channels*5);k+=5) {      
      // remap note to st3-style, 255=no note, 254=note off
      if (this.pattern[i][k+0]>=97) {
        this.pattern[i][k+0]=254;
      } else if (this.pattern[i][k+0]==0) {
        this.pattern[i][k+0]=255;
      } else {
        this.pattern[i][k+0]--;
      }

      // command 255=no command
      if (this.pattern[i][k+3]==0 && this.pattern[i][k+4]==0) this.pattern[i][k+3]=255;

      // remap volume column setvol to 0x00..0x40, tone porta to 0x50..0x5f and 0xff for nop
      if (this.pattern[i][k+2]<0x10) { this.pattern[i][k+2]=0xff; }
      else if (this.pattern[i][k+2]>=0x10 && this.pattern[i][k+2]<=0x50) { this.pattern[i][k+2]-=0x10; }
      else if (this.pattern[i][k+2]>=0xf0) this.pattern[i][k+2]-=0xa0;
    }
    
    // unpack next pattern
    offset+=j;
    i++;
  }
  this.patterns=maxpatt;

  // instruments
  this.instrument=new Array(this.instruments);
  i=0;
  while(i<this.instruments) {
    hdrlen=le_dword(buffer, offset);
    this.instrument[i]=new Object();
    this.instrument[i].sample=new Array();
    this.instrument[i].name="";
    j=0;
    while(buffer[offset+4+j] && j<22)
      this.instrument[i].name+=dos2utf(buffer[offset+4+j++]);
    this.instrument[i].samples=le_word(buffer, offset+27);

    // initialize to defaults
    this.instrument[i].samplemap=new Uint8Array(96);
    for(j=0;j<96;j++) this.instrument[i].samplemap[j]=0;
    this.instrument[i].volenv=new Float32Array(325);
    this.instrument[i].panenv=new Float32Array(325);
    this.instrument[i].voltype=0;
    this.instrument[i].pantype=0;
    for(j=0;j<=this.instrument[i].samples;j++) {
      this.instrument[i].sample[j]={
        bits:8, stereo:0, bps:1,
        length:0, loopstart:0, looplength:0, loopend:0, looptype:0,
        volume:64, finetune:0, relativenote:0, panning:128, name:"",
        data:new Float32Array(0)
      };
    }

    if (this.instrument[i].samples) {
      var smphdrlen=le_dword(buffer, offset+29);

      for(j=0;j<96;j++) this.instrument[i].samplemap[j]=buffer[offset+33+j];

      // envelope points. the xm specs say 48 bytes per envelope, but while that may
      // technically be correct, what they don't say is that it means 12 pairs of
      // little endian words. first word is the x coordinate, second is y. point
      // 0 always has x=0.
      var tmp_volenv=new Array(12);
      var tmp_panenv=new Array(12);
      for(j=0;j<12;j++) {
        tmp_volenv[j]=new Uint16Array([le_word(buffer, offset+129+j*4), le_word(buffer, offset+129+j*4+2)]);
        tmp_panenv[j]=new Uint16Array([le_word(buffer, offset+177+j*4), le_word(buffer, offset+177+j*4+2)]);
      }

      // are envelopes enabled?
      this.instrument[i].voltype=buffer[offset+233]; // 1=enabled, 2=sustain, 4=loop
      this.instrument[i].pantype=buffer[offset+234];

      // pre-interpolate the envelopes to arrays of [0..1] float32 values which
      // are stepped through at a rate of one per tick. max tick count is 0x0144.

      // volume envelope
      for(j=0;j<325;j++) this.instrument[i].volenv[j]=1.0;
      if (this.instrument[i].voltype&1) {
        for(j=0;j<325;j++) {
          var p, delta;
          p=1;
          while(tmp_volenv[p][0]<j && p<11) p++;
          if (tmp_volenv[p][0] == tmp_volenv[p-1][0]) { delta=0; } else {
            delta=(tmp_volenv[p][1]-tmp_volenv[p-1][1]) / (tmp_volenv[p][0]-tmp_volenv[p-1][0]);
          }
          this.instrument[i].volenv[j]=(tmp_volenv[p-1][1] + delta*(j-tmp_volenv[p-1][0]))/64.0;
        }
        this.instrument[i].volenvlen=tmp_volenv[Math.max(0, buffer[offset+225]-1)][0];
        this.instrument[i].volsustain=tmp_volenv[buffer[offset+227]][0];
        this.instrument[i].volloopstart=tmp_volenv[buffer[offset+228]][0];
        this.instrument[i].volloopend=tmp_volenv[buffer[offset+229]][0];
      }

      // pan envelope
      for(j=0;j<325;j++) this.instrument[i].panenv[j]=0.5;
      if (this.instrument[i].pantype&1) {
        for(j=0;j<325;j++) {
          var p, delta;
          p=1;
          while(tmp_panenv[p][0]<j && p<11) p++;
          if (tmp_panenv[p][0] == tmp_panenv[p-1][0]) { delta=0; } else {
            delta=(tmp_panenv[p][1]-tmp_panenv[p-1][1]) / (tmp_panenv[p][0]-tmp_panenv[p-1][0]);
          }
          this.instrument[i].panenv[j]=(tmp_panenv[p-1][1] + delta*(j-tmp_panenv[p-1][0]))/64.0;
        }
        this.instrument[i].panenvlen=tmp_panenv[Math.max(0, buffer[offset+226]-1)][0];
        this.instrument[i].pansustain=tmp_panenv[buffer[offset+230]][0];
        this.instrument[i].panloopstart=tmp_panenv[buffer[offset+231]][0];
        this.instrument[i].panloopend=tmp_panenv[buffer[offset+232]][0];
      }

      // vibrato
      this.instrument[i].vibratotype=buffer[offset+235];
      this.instrument[i].vibratosweep=buffer[offset+236];
      this.instrument[i].vibratodepth=buffer[offset+237];
      this.instrument[i].vibratorate=buffer[offset+238];

      // volume fade out
      this.instrument[i].volfadeout=le_word(buffer, offset+239);

      // sample headers
      offset+=hdrlen;
      this.instrument[i].sample=new Array(this.instrument[i].samples);
      for(j=0;j<this.instrument[i].samples;j++) {
        datalen=le_dword(buffer, offset+0);

        this.instrument[i].sample[j]=new Object();
        this.instrument[i].sample[j].bits=(buffer[offset+14]&16)?16:8;
        this.instrument[i].sample[j].stereo=0;
        this.instrument[i].sample[j].bps=(this.instrument[i].sample[j].bits==16)?2:1; // bytes per sample

        // sample length and loop points are in BYTES even for 16-bit samples!
        this.instrument[i].sample[j].length=datalen / this.instrument[i].sample[j].bps;
        this.instrument[i].sample[j].loopstart=le_dword(buffer, offset+4) / this.instrument[i].sample[j].bps;
        this.instrument[i].sample[j].looplength=le_dword(buffer, offset+8) / this.instrument[i].sample[j].bps;
        this.instrument[i].sample[j].loopend=this.instrument[i].sample[j].loopstart+this.instrument[i].sample[j].looplength;
        this.instrument[i].sample[j].looptype=buffer[offset+14]&0x03;

        this.instrument[i].sample[j].volume=buffer[offset+12];

        // finetune and seminote tuning
        if (buffer[offset+13]<128) {
          this.instrument[i].sample[j].finetune=buffer[offset+13];
        } else {
          this.instrument[i].sample[j].finetune=buffer[offset+13]-256;
        }
        if (buffer[offset+16]<128) {
          this.instrument[i].sample[j].relativenote=buffer[offset+16];
        } else {
          this.instrument[i].sample[j].relativenote=buffer[offset+16]-256;
        }

        this.instrument[i].sample[j].panning=buffer[offset+15];

        k=0; this.instrument[i].sample[j].name="";
        while(buffer[offset+18+k] && k<22) this.instrument[i].sample[j].name+=dos2utf(buffer[offset+18+k++]);

        offset+=smphdrlen;
      }

      // sample data (convert to signed float32)
      for(j=0;j<this.instrument[i].samples;j++) {
        this.instrument[i].sample[j].data=new Float32Array(this.instrument[i].sample[j].length);
        c=0;
        if (this.instrument[i].sample[j].bits==16) {
          for(k=0;k<this.instrument[i].sample[j].length;k++) {
            c+=s_le_word(buffer, offset+k*2);
            if (c<-32768) c+=65536;
            if (c>32767) c-=65536;
            this.instrument[i].sample[j].data[k]=c/32768.0;
          }
        } else {
          for(k=0;k<this.instrument[i].sample[j].length;k++) {
            c+=s_byte(buffer, offset+k);
            if (c<-128) c+=256;
            if (c>127) c-=256;
            this.instrument[i].sample[j].data[k]=c/128.0;
          }
        }
        offset+=this.instrument[i].sample[j].length * this.instrument[i].sample[j].bps;
      }
    } else {
      offset+=hdrlen;
    }
    i++;
  }

  this.mixval=4.0-2.0*(this.channels/32.0);

  this.chvu=new Float32Array(this.channels);
  for(i=0;i<this.channels;i++) this.chvu[i]=0.0;

  return true;
};



// calculate period value for note
Fasttracker.prototype.calcperiod = function(mod, note, finetune) {
  var pv;
  if (mod.amigaperiods) {
    var ft=Math.floor(finetune/16.0); // = -8 .. 7
    var p1=mod.periodtable[ 8 + (note%12)*8 + ft ];
    var p2=mod.periodtable[ 8 + (note%12)*8 + ft + 1];
    ft=(finetune/16.0) - ft;
    pv=((1.0-ft)*p1 + ft*p2)*( 16.0/Math.pow(2, Math.floor(note/12)-1) );
  } else {
    pv=7680.0 - note*64.0 - finetune/2;
  }
  return pv;
};



// advance player by a tick
Fasttracker.prototype.advance = function(mod) {
  mod.stt=Math.floor((125.0/mod.bpm) * (1/50.0)*mod.samplerate); // 50Hz

  // advance player
  mod.tick++;
  mod.flags|=1;

  // new row on this tick?
  if (mod.tick>=mod.speed) {
    if (mod.patterndelay) { // delay pattern
      if (mod.tick < ((mod.patternwait+1)*mod.speed)) {
        mod.patternwait++;
      } else {
        mod.row++; mod.tick=0; mod.flags|=2; mod.patterndelay=0;
      }
    } else {
      if (mod.flags&(16+32+64)) {
        if (mod.flags&64) { // loop pattern?
          mod.row=mod.looprow;
          mod.flags&=0xa1;
          mod.flags|=2;
        } else {
          if (mod.flags&16) { // pattern jump/break?
            mod.position=mod.patternjump;
            mod.row=mod.breakrow;
            mod.patternjump=0;
            mod.breakrow=0;
            mod.flags&=0xe1;
            mod.flags|=2;
          }
        }
        mod.tick=0;
      } else {
        mod.row++; mod.tick=0; mod.flags|=2;
      }
    }
  }
  
  // step to new pattern?
  if (mod.row>=mod.patternlen[mod.patterntable[mod.position]]) {
    mod.position++;
    mod.row=0;
    mod.flags|=4;
  }
  
  // end of song?
  if (mod.position>=mod.songlen) {
    if (mod.repeat) {
      mod.position=0;
    } else {
      this.endofsong=true;
    }
    return;
  }
};



// process one channel on a row in pattern p, pp is an offset to pattern data
Fasttracker.prototype.process_note = function(mod, p, ch) {
  var n, i, s, v, pp, pv;

  pp=mod.row*5*mod.channels + ch*5;
  n=mod.pattern[p][pp];
  i=mod.pattern[p][pp+1];
  if (i && i<=mod.instrument.length) {
    mod.channel[ch].instrument=i-1;

    if (mod.instrument[i-1].samples) {
      s=mod.instrument[i-1].samplemap[mod.channel[ch].note];
      mod.channel[ch].sampleindex=s;
      mod.channel[ch].volume=mod.instrument[i-1].sample[s].volume;
      mod.channel[ch].playdir=1; // fixes crash in respirator.xm pos 0x12
      
      // set pan from sample
      mod.pan[ch]=mod.instrument[i-1].sample[s].panning/255.0;
    }
    mod.channel[ch].voicevolume=mod.channel[ch].volume;
  }
  i=mod.channel[ch].instrument;

  if (n<254) {
    // look up the sample
    s=mod.instrument[i].samplemap[n];
    mod.channel[ch].sampleindex=s;

    var rn=n + mod.instrument[i].sample[s].relativenote;

    // calc period for note
    pv=mod.calcperiod(mod, rn, mod.instrument[i].sample[s].finetune);

    if (mod.channel[ch].noteon) {
      // retrig note, except if command=0x03 (porta to note) or 0x05 (porta+volslide)
      if ((mod.channel[ch].command != 0x03) && (mod.channel[ch].command != 0x05)) {
        mod.channel[ch].note=n;
        mod.channel[ch].period=pv;
        mod.channel[ch].voiceperiod=mod.channel[ch].period;
        mod.channel[ch].flags|=3; // force sample speed recalc

        mod.channel[ch].trigramp=0.0;
        mod.channel[ch].trigrampfrom=mod.channel[ch].currentsample;

        mod.channel[ch].samplepos=0;
        mod.channel[ch].playdir=1;
        if (mod.channel[ch].vibratowave>3) mod.channel[ch].vibratopos=0;

        mod.channel[ch].noteon=1;

        mod.channel[ch].fadeoutpos=65535;
        mod.channel[ch].volenvpos=0;
        mod.channel[ch].panenvpos=0;
      }
    } else {
      // note is off, restart but don't set period if slide command
      if (mod.pattern[p][pp+1]) { // instrument set on row?
        mod.channel[ch].samplepos=0;
        mod.channel[ch].playdir=1;
        if (mod.channel[ch].vibratowave>3) mod.channel[ch].vibratopos=0;
        mod.channel[ch].noteon=1;
        mod.channel[ch].fadeoutpos=65535;
        mod.channel[ch].volenvpos=0;
        mod.channel[ch].panenvpos=0;
        mod.channel[ch].trigramp=0.0;
        mod.channel[ch].trigrampfrom=mod.channel[ch].currentsample;        
      }
      if ((mod.channel[ch].command != 0x03) && (mod.channel[ch].command != 0x05)) {
        mod.channel[ch].note=n;
        mod.channel[ch].period=pv;
        mod.channel[ch].voiceperiod=mod.channel[ch].period;
        mod.channel[ch].flags|=3; // force sample speed recalc
      }
    }
    // in either case, set the slide to note target to note period
    mod.channel[ch].slideto=pv;
  } else if (n==254) {
    mod.channel[ch].noteon=0; // note off
    if (!(mod.instrument[i].voltype&1)) mod.channel[ch].voicevolume=0;
  }

  if (mod.pattern[p][pp+2]!=255) {
    v=mod.pattern[p][pp+2];
    if (v<=0x40) {
      mod.channel[ch].volume=v;
      mod.channel[ch].voicevolume=mod.channel[ch].volume;
    }
  }
};



// advance player and all channels by a tick
Fasttracker.prototype.process_tick = function(mod) {

  // advance global player state by a tick  
  mod.advance(mod);

  // advance all channels by a tick  
  for(var ch=0;ch<mod.channels;ch++) {
  
    // calculate playback position
    var p=mod.patterntable[mod.position];
    var pp=mod.row*5*mod.channels + ch*5;

    // save old volume if ramping is needed
    mod.channel[ch].oldfinalvolume=mod.channel[ch].finalvolume;

    if (mod.flags&2) { // new row on this tick?
      mod.channel[ch].command=mod.pattern[p][pp+3];
      mod.channel[ch].data=mod.pattern[p][pp+4];
      if (!(mod.channel[ch].command==0x0e && (mod.channel[ch].data&0xf0)==0xd0)) { // note delay?
        mod.process_note(mod, p, ch);
      }
    }
    i=mod.channel[ch].instrument;
    si=mod.channel[ch].sampleindex;

    // kill empty instruments
    if (mod.channel[ch].noteon && !mod.instrument[i].samples) {
      mod.channel[ch].noteon=0;
    }

    // effects
    var v=mod.pattern[p][pp+2];
    if (v>=0x50 && v<0xf0) {
      if (!mod.tick) mod.voleffects_t0[(v>>4)-5](mod, ch, v&0x0f);
       else mod.voleffects_t1[(v>>4)-5](mod, ch, v&0x0f);
    }
    if (mod.channel[ch].command < 36) {
      if (!mod.tick) {
        // process only on tick 0
        mod.effects_t0[mod.channel[ch].command](mod, ch);
      } else {
        mod.effects_t1[mod.channel[ch].command](mod, ch);
      }
    }

    // recalc sample speed if voiceperiod has changed
    if ((mod.channel[ch].flags&1 || mod.flags&2) && mod.channel[ch].voiceperiod)
    {
      var f;
      if (mod.amigaperiods) {
        f=8287.137 * 1712.0/mod.channel[ch].voiceperiod;
      } else {
        f=8287.137 * Math.pow(2.0, (4608.0 - mod.channel[ch].voiceperiod) / 768.0);
      }
      mod.channel[ch].samplespeed=f/mod.samplerate;
    }

    // advance vibrato on each new tick
    mod.channel[ch].vibratopos+=mod.channel[ch].vibratospeed;
    mod.channel[ch].vibratopos&=0x3f;

    // advance volume envelope, if enabled (also fadeout)
    if (mod.instrument[i].voltype&1) {
      mod.channel[ch].volenvpos++;

      if (mod.channel[ch].noteon &&
          (mod.instrument[i].voltype&2) &&
          mod.channel[ch].volenvpos >= mod.instrument[i].volsustain)
        mod.channel[ch].volenvpos=mod.instrument[i].volsustain;

      if ((mod.instrument[i].voltype&4) &&
          mod.channel[ch].volenvpos >= mod.instrument[i].volloopend)
        mod.channel[ch].volenvpos=mod.instrument[i].volloopstart;

      if (mod.channel[ch].volenvpos >= mod.instrument[i].volenvlen)
        mod.channel[ch].volenvpos=mod.instrument[i].volenvlen;

      if (mod.channel[ch].volenvpos>324) mod.channel[ch].volenvpos=324;

      // fadeout if note is off
      if (!mod.channel[ch].noteon && mod.channel[ch].fadeoutpos) {
        mod.channel[ch].fadeoutpos-=mod.instrument[i].volfadeout;
        if (mod.channel[ch].fadeoutpos<0) mod.channel[ch].fadeoutpos=0;
      }
    }

    // advance pan envelope, if enabled
    if (mod.instrument[i].pantype&1) {
      mod.channel[ch].panenvpos++;

      if (mod.channel[ch].noteon &&
          mod.instrument[i].pantype&2 &&
          mod.channel[ch].panenvpos >= mod.instrument[i].pansustain)
        mod.channel[ch].panenvpos=mod.instrument[i].pansustain;

      if (mod.instrument[i].pantype&4 &&
          mod.channel[ch].panenvpos >= mod.instrument[i].panloopend)
        mod.channel[ch].panenvpos=mod.instrument[i].panloopstart;

      if (mod.channel[ch].panenvpos >= mod.instrument[i].panenvlen)
        mod.channel[ch].panenvpos=mod.instrument[i].panenvlen;

      if (mod.channel[ch].panenvpos>324) mod.channel[ch].panenvpos=324;
    }
    
    // calc final volume for channel
    mod.channel[ch].finalvolume=mod.channel[ch].voicevolume * mod.instrument[i].volenv[mod.channel[ch].volenvpos] * mod.channel[ch].fadeoutpos/65536.0;

    // calc final panning for channel
    mod.finalpan[ch]=mod.pan[ch]+(mod.instrument[i].panenv[mod.channel[ch].panenvpos]-0.5)*(0.5*Math.abs(mod.pan[ch]-0.5))*2.0;

    // setup volramp if voice volume changed
    if (mod.channel[ch].oldfinalvolume!=mod.channel[ch].finalvolume) {
      mod.channel[ch].volrampfrom=mod.channel[ch].oldfinalvolume;
      mod.channel[ch].volramp=0.0;
    }
    
    // clear channel flags
    mod.channel[ch].flags=0;
  }

  // clear global flags after all channels are processed
  mod.flags&=0x70;
};



// mix a buffer of audio for an audio processing event
Fasttracker.prototype.mix = function(mod, bufs, buflen) {
  var outp=new Float32Array(2);

  // return a buffer of silence if not playing
  if (mod.paused || mod.endofsong || !mod.playing) {
    for(var s=0;s<buflen;s++) {
      bufs[0][s]=0.0;
      bufs[1][s]=0.0;
      for(var ch=0;ch<mod.chvu.length;ch++) mod.chvu[ch]=0.0;
    }
    return;
  }

  // fill audiobuffer
  for(var s=0;s<buflen;s++)
  {
    outp[0]=0.0;
    outp[1]=0.0;
    
    // if STT has run out, step player forward by tick
    if (mod.stt<=0) mod.process_tick(mod);

    // mix channels
    for(var ch=0;ch<mod.channels;ch++)
    {
      var fl=0.0, fr=0.0, fs=0.0;
      var i=mod.channel[ch].instrument;
      var si=mod.channel[ch].sampleindex;
      
      // add channel output to left/right master outputs
      if (mod.channel[ch].noteon ||
          ((mod.instrument[i].voltype&1) && !mod.channel[ch].noteon && mod.channel[ch].fadeoutpos) ||
          (!mod.channel[ch].noteon && mod.channel[ch].volramp<1.0)
         ) {
        if (mod.instrument[i].sample[si].length > mod.channel[ch].samplepos) {
          fl=mod.channel[ch].lastsample;

          // interpolate towards current sample
          var f=Math.floor(mod.channel[ch].samplepos);
          fs=mod.instrument[i].sample[si].data[f];
          f=mod.channel[ch].samplepos - f;
          f=(mod.channel[ch].playdir<0) ? (1.0-f) : f;
          fl=f*fs + (1.0-f)*fl;

          // smooth out discontinuities from retrig and sample offset
          f=mod.channel[ch].trigramp;
          fl=f*fl + (1.0-f)*mod.channel[ch].trigrampfrom;
          f+=1.0/128.0;
          mod.channel[ch].trigramp=Math.min(1.0, f);
          mod.channel[ch].currentsample=fl;

          // ramp volume changes over 64 samples to avoid clicks
          fr=fl*(mod.channel[ch].finalvolume/64.0);
          f=mod.channel[ch].volramp;
          fl=f*fr + (1.0-f)*(fl*(mod.channel[ch].volrampfrom/64.0));
          f+=(1.0/64.0);
          mod.channel[ch].volramp=Math.min(1.0, f);

          // pan samples, if envelope is disabled panvenv is always 0.5
          f=mod.finalpan[ch];
          fr=fl*f;
          fl*=1.0-f;
        }
        outp[0]+=fl;
        outp[1]+=fr;

        // advance sample position and check for loop or end
        var oldpos=mod.channel[ch].samplepos;
        mod.channel[ch].samplepos+=mod.channel[ch].playdir*mod.channel[ch].samplespeed;
        if (mod.channel[ch].playdir==1) {
          if (Math.floor(mod.channel[ch].samplepos) > Math.floor(oldpos)) mod.channel[ch].lastsample=fs;
        } else {
          if (Math.floor(mod.channel[ch].samplepos) < Math.floor(oldpos)) mod.channel[ch].lastsample=fs;
        }

        if (mod.instrument[i].sample[si].looptype) {
          if (mod.instrument[i].sample[si].looptype==2) {
            // pingpong loop
            if (mod.channel[ch].playdir==-1) {
              // bounce off from start?
              if (mod.channel[ch].samplepos <= mod.instrument[i].sample[si].loopstart) {
                mod.channel[ch].samplepos+=(mod.instrument[i].sample[si].loopstart-mod.channel[ch].samplepos);
                mod.channel[ch].playdir=1;
                mod.channel[ch].lastsample=mod.channel[ch].currentsample;
              }
            } else {
              // bounce off from end?
              if (mod.channel[ch].samplepos >= mod.instrument[i].sample[si].loopend) {
                mod.channel[ch].samplepos-=(mod.channel[ch].samplepos-mod.instrument[i].sample[si].loopend);
                mod.channel[ch].playdir=-1;
                mod.channel[ch].lastsample=mod.channel[ch].currentsample;
              }
            }
          } else {
            // normal loop
            if (mod.channel[ch].samplepos >= mod.instrument[i].sample[si].loopend) {
              mod.channel[ch].samplepos-=mod.instrument[i].sample[si].looplength;
              mod.channel[ch].lastsample=mod.channel[ch].currentsample;
            }
          }
        } else {
          if (mod.channel[ch].samplepos >= mod.instrument[i].sample[si].length) {
            mod.channel[ch].noteon=0;
          }
        }
      } else {
        mod.channel[ch].currentsample=0.0; // note is completely off
      }
      mod.chvu[ch]=Math.max(mod.chvu[ch], Math.abs(fl+fr));
    }

    // done - store to output buffer
    t=mod.volume/64.0;
    bufs[0][s]=outp[0]*t;
    bufs[1][s]=outp[1]*t;
    mod.stt--;
  }
};



//
// volume column effect functions
//
Fasttracker.prototype.effect_vol_t0_60=function(mod, ch, data) { // 60-6f vol slide down
};
Fasttracker.prototype.effect_vol_t0_70=function(mod, ch, data) { // 70-7f vol slide up
};
Fasttracker.prototype.effect_vol_t0_80=function(mod, ch, data) { // 80-8f fine vol slide down
  mod.channel[ch].voicevolume-=data;
  if (mod.channel[ch].voicevolume<0) mod.channel[ch].voicevolume=0;
};
Fasttracker.prototype.effect_vol_t0_90=function(mod, ch, data) { // 90-9f fine vol slide up
  mod.channel[ch].voicevolume+=data;
  if (mod.channel[ch].voicevolume>64) mod.channel[ch].voicevolume=64;
};
Fasttracker.prototype.effect_vol_t0_a0=function(mod, ch, data) { // a0-af set vibrato speed
  mod.channel[ch].vibratospeed=data;
};
Fasttracker.prototype.effect_vol_t0_b0=function(mod, ch, data) { // b0-bf vibrato
  if (data) mod.channel[ch].vibratodepth=data;
  mod.effect_t1_4(mod, ch);
};
Fasttracker.prototype.effect_vol_t0_c0=function(mod, ch, data) { // c0-cf set panning
  mod.pan[ch]=(data&0x0f)/15.0;
};
Fasttracker.prototype.effect_vol_t0_d0=function(mod, ch, data) { // d0-df panning slide left
};
Fasttracker.prototype.effect_vol_t0_e0=function(mod, ch, data) { // e0-ef panning slide right
};
Fasttracker.prototype.effect_vol_t0_f0=function(mod, ch, data) { // f0-ff tone porta
//  if (data) mod.channel[ch].slidetospeed=data;
//  if (!mod.amigaperiods) mod.channel[ch].slidetospeed*=4;
};
//////
Fasttracker.prototype.effect_vol_t1_60=function(mod, ch, data) { // 60-6f vol slide down
  mod.channel[ch].voicevolume-=data;
  if (mod.channel[ch].voicevolume<0) mod.channel[ch].voicevolume=0;
};
Fasttracker.prototype.effect_vol_t1_70=function(mod, ch, data) { // 70-7f vol slide up
  mod.channel[ch].voicevolume+=data;
  if (mod.channel[ch].voicevolume>64) mod.channel[ch].voicevolume=64;
};
Fasttracker.prototype.effect_vol_t1_80=function(mod, ch, data) { // 80-8f fine vol slide down
};
Fasttracker.prototype.effect_vol_t1_90=function(mod, ch, data) { // 90-9f fine vol slide up
};
Fasttracker.prototype.effect_vol_t1_a0=function(mod, ch, data) { // a0-af set vibrato speed
};
Fasttracker.prototype.effect_vol_t1_b0=function(mod, ch, data) { // b0-bf vibrato
  mod.effect_t1_4(mod, ch); // same as effect column vibrato on ticks 1+
};
Fasttracker.prototype.effect_vol_t1_c0=function(mod, ch, data) { // c0-cf set panning
};
Fasttracker.prototype.effect_vol_t1_d0=function(mod, ch, data) { // d0-df panning slide left
};
Fasttracker.prototype.effect_vol_t1_e0=function(mod, ch, data) { // e0-ef panning slide right
};
Fasttracker.prototype.effect_vol_t1_f0=function(mod, ch, data) { // f0-ff tone porta
//  mod.effect_t1_3(mod, ch);
};



//
// tick 0 effect functions
//
Fasttracker.prototype.effect_t0_0=function(mod, ch) { // 0 arpeggio
  mod.channel[ch].arpeggio=mod.channel[ch].data;
};
Fasttracker.prototype.effect_t0_1=function(mod, ch) { // 1 slide up
  if (mod.channel[ch].data) mod.channel[ch].slideupspeed=mod.channel[ch].data*4;
};
Fasttracker.prototype.effect_t0_2=function(mod, ch) { // 2 slide down
  if (mod.channel[ch].data) mod.channel[ch].slidedownspeed=mod.channel[ch].data*4;
};
Fasttracker.prototype.effect_t0_3=function(mod, ch) { // 3 slide to note
  if (mod.channel[ch].data) mod.channel[ch].slidetospeed=mod.channel[ch].data*4;
};
Fasttracker.prototype.effect_t0_4=function(mod, ch) { // 4 vibrato
  if (mod.channel[ch].data&0x0f && mod.channel[ch].data&0xf0) {
    mod.channel[ch].vibratodepth=(mod.channel[ch].data&0x0f);
    mod.channel[ch].vibratospeed=(mod.channel[ch].data&0xf0)>>4;
  }
  mod.effect_t1_4(mod, ch);
};
Fasttracker.prototype.effect_t0_5=function(mod, ch) { // 5
  mod.effect_t0_a(mod, ch);
};
Fasttracker.prototype.effect_t0_6=function(mod, ch) { // 6
  mod.effect_t0_a(mod, ch);
};
Fasttracker.prototype.effect_t0_7=function(mod, ch) { // 7
};
Fasttracker.prototype.effect_t0_8=function(mod, ch) { // 8 set panning
  mod.pan[ch]=mod.channel[ch].data/255.0;
};
Fasttracker.prototype.effect_t0_9=function(mod, ch) { // 9 set sample offset
  mod.channel[ch].samplepos=mod.channel[ch].data*256;
  mod.channel[ch].playdir=1;

  mod.channel[ch].trigramp=0.0;
  mod.channel[ch].trigrampfrom=mod.channel[ch].currentsample;
};
Fasttracker.prototype.effect_t0_a=function(mod, ch) { // a volume slide
  // this behavior differs from protracker!! A00 will slide using previous non-zero parameter.
  if (mod.channel[ch].data) mod.channel[ch].volslide=mod.channel[ch].data;
};
Fasttracker.prototype.effect_t0_b=function(mod, ch) { // b pattern jump
  mod.breakrow=0;
  mod.patternjump=mod.channel[ch].data;
  mod.flags|=16;
};
Fasttracker.prototype.effect_t0_c=function(mod, ch) { // c set volume
  mod.channel[ch].voicevolume=mod.channel[ch].data;
  if (mod.channel[ch].voicevolume<0) mod.channel[ch].voicevolume=0;
  if (mod.channel[ch].voicevolume>64) mod.channel[ch].voicevolume=64;
};
Fasttracker.prototype.effect_t0_d=function(mod, ch) { // d pattern break
  mod.breakrow=((mod.channel[ch].data&0xf0)>>4)*10 + (mod.channel[ch].data&0x0f);
  if (!(mod.flags&16)) mod.patternjump=mod.position+1;
  mod.flags|=16;
};
Fasttracker.prototype.effect_t0_e=function(mod, ch) { // e
  var i=(mod.channel[ch].data&0xf0)>>4;
  mod.effects_t0_e[i](mod, ch);
};
Fasttracker.prototype.effect_t0_f=function(mod, ch) { // f set speed
  if (mod.channel[ch].data > 32) {
    mod.bpm=mod.channel[ch].data;
  } else {
    if (mod.channel[ch].data) mod.speed=mod.channel[ch].data;
  }
};
Fasttracker.prototype.effect_t0_g=function(mod, ch) { // g set global volume
  if (mod.channel[ch].data<=0x40) mod.volume=mod.channel[ch].data;
};
Fasttracker.prototype.effect_t0_h=function(mod, ch) { // h global volume slide
  if (mod.channel[ch].data) mod.globalvolslide=mod.channel[ch].data;
};
Fasttracker.prototype.effect_t0_i=function(mod, ch) { // i
};
Fasttracker.prototype.effect_t0_j=function(mod, ch) { // j
};
Fasttracker.prototype.effect_t0_k=function(mod, ch) { // k key off
  mod.channel[ch].noteon=0;
  if (!(mod.instrument[mod.channel[ch].instrument].voltype&1)) mod.channel[ch].voicevolume=0;
};
Fasttracker.prototype.effect_t0_l=function(mod, ch) { // l set envelope position
  mod.channel[ch].volenvpos=mod.channel[ch].data;
  mod.channel[ch].panenvpos=mod.channel[ch].data;
};
Fasttracker.prototype.effect_t0_m=function(mod, ch) { // m
};
Fasttracker.prototype.effect_t0_n=function(mod, ch) { // n
};
Fasttracker.prototype.effect_t0_o=function(mod, ch) { // o
};
Fasttracker.prototype.effect_t0_p=function(mod, ch) { // p panning slide
};
Fasttracker.prototype.effect_t0_q=function(mod, ch) { // q
};
Fasttracker.prototype.effect_t0_r=function(mod, ch) { // r multi retrig note
};
Fasttracker.prototype.effect_t0_s=function(mod, ch) { // s
};
Fasttracker.prototype.effect_t0_t=function(mod, ch) { // t tremor
};
Fasttracker.prototype.effect_t0_u=function(mod, ch) { // u
};
Fasttracker.prototype.effect_t0_v=function(mod, ch) { // v
};
Fasttracker.prototype.effect_t0_w=function(mod, ch) { // w
};
Fasttracker.prototype.effect_t0_x=function(mod, ch) { // x extra fine porta up/down
};
Fasttracker.prototype.effect_t0_y=function(mod, ch) { // y
};
Fasttracker.prototype.effect_t0_z=function(mod, ch) { // z
};



//
// tick 0 effect e functions
//
Fasttracker.prototype.effect_t0_e0=function(mod, ch) { // e0 filter on/off
};
Fasttracker.prototype.effect_t0_e1=function(mod, ch) { // e1 fine slide up
  mod.channel[ch].period-=mod.channel[ch].data&0x0f;
  if (mod.channel[ch].period < 113) mod.channel[ch].period=113;
};
Fasttracker.prototype.effect_t0_e2=function(mod, ch) { // e2 fine slide down
  mod.channel[ch].period+=mod.channel[ch].data&0x0f;
  if (mod.channel[ch].period > 856) mod.channel[ch].period=856;
  mod.channel[ch].flags|=1;
};
Fasttracker.prototype.effect_t0_e3=function(mod, ch) { // e3 set glissando
};
Fasttracker.prototype.effect_t0_e4=function(mod, ch) { // e4 set vibrato waveform
  mod.channel[ch].vibratowave=mod.channel[ch].data&0x07;
};
Fasttracker.prototype.effect_t0_e5=function(mod, ch) { // e5 set finetune
};
Fasttracker.prototype.effect_t0_e6=function(mod, ch) { // e6 loop pattern
  if (mod.channel[ch].data&0x0f) {
    if (mod.loopcount) {
      mod.loopcount--;
    } else {
      mod.loopcount=mod.channel[ch].data&0x0f;
    }
    if (mod.loopcount) mod.flags|=64;
  } else {
    mod.looprow=mod.row;
  }
};
Fasttracker.prototype.effect_t0_e7=function(mod, ch) { // e7
};
Fasttracker.prototype.effect_t0_e8=function(mod, ch) { // e8, use for syncing
  mod.syncqueue.unshift(mod.channel[ch].data&0x0f);
};
Fasttracker.prototype.effect_t0_e9=function(mod, ch) { // e9
};
Fasttracker.prototype.effect_t0_ea=function(mod, ch) { // ea fine volslide up
  mod.channel[ch].voicevolume+=mod.channel[ch].data&0x0f;
  if (mod.channel[ch].voicevolume > 64) mod.channel[ch].voicevolume=64;
};
Fasttracker.prototype.effect_t0_eb=function(mod, ch) { // eb fine volslide down
  mod.channel[ch].voicevolume-=mod.channel[ch].data&0x0f;
  if (mod.channel[ch].voicevolume < 0) mod.channel[ch].voicevolume=0;
};
Fasttracker.prototype.effect_t0_ec=function(mod, ch) { // ec
};
Fasttracker.prototype.effect_t0_ed=function(mod, ch) { // ed delay sample
  if (mod.tick==(mod.channel[ch].data&0x0f)) {
    mod.process_note(mod, mod.patterntable[mod.position], ch);
  }
};
Fasttracker.prototype.effect_t0_ee=function(mod, ch) { // ee delay pattern
  mod.patterndelay=mod.channel[ch].data&0x0f;
  mod.patternwait=0;
};
Fasttracker.prototype.effect_t0_ef=function(mod, ch) { // ef
};



//
// tick 1+ effect functions
//
Fasttracker.prototype.effect_t1_0=function(mod, ch) { // 0 arpeggio
  if (mod.channel[ch].data) {
    var i=mod.channel[ch].instrument;
    var apn=mod.channel[ch].note;
    if ((mod.tick%3)==1) apn+=mod.channel[ch].arpeggio>>4;
    if ((mod.tick%3)==2) apn+=mod.channel[ch].arpeggio&0x0f;

    var s=mod.channel[ch].sampleindex;
    mod.channel[ch].voiceperiod=mod.calcperiod(mod, apn+mod.instrument[i].sample[s].relativenote, mod.instrument[i].sample[s].finetune);
    mod.channel[ch].flags|=1;
  }
};
Fasttracker.prototype.effect_t1_1=function(mod, ch) { // 1 slide up
  mod.channel[ch].voiceperiod-=mod.channel[ch].slideupspeed;
  if (mod.channel[ch].voiceperiod<1) mod.channel[ch].voiceperiod+=65535; // yeah, this is how it supposedly works in ft2...
  mod.channel[ch].flags|=3; // recalc speed
};
Fasttracker.prototype.effect_t1_2=function(mod, ch) { // 2 slide down
  mod.channel[ch].voiceperiod+=mod.channel[ch].slidedownspeed;
  if (mod.channel[ch].voiceperiod>7680) mod.channel[ch].voiceperiod=7680;
  mod.channel[ch].flags|=3; // recalc speed
};
Fasttracker.prototype.effect_t1_3=function(mod, ch) { // 3 slide to note
  if (mod.channel[ch].voiceperiod < mod.channel[ch].slideto) {
    mod.channel[ch].voiceperiod+=mod.channel[ch].slidetospeed;
    if (mod.channel[ch].voiceperiod > mod.channel[ch].slideto)
      mod.channel[ch].voiceperiod=mod.channel[ch].slideto;
  }
  if (mod.channel[ch].voiceperiod > mod.channel[ch].slideto) {
    mod.channel[ch].voiceperiod-=mod.channel[ch].slidetospeed;
    if (mod.channel[ch].voiceperiod<mod.channel[ch].slideto)
      mod.channel[ch].voiceperiod=mod.channel[ch].slideto;
  }
  mod.channel[ch].flags|=3; // recalc speed
};
Fasttracker.prototype.effect_t1_4=function(mod, ch) { // 4 vibrato
  var waveform=mod.vibratotable[mod.channel[ch].vibratowave&3][mod.channel[ch].vibratopos]/63.0;
  var a=mod.channel[ch].vibratodepth*waveform;
  mod.channel[ch].voiceperiod+=a;
  mod.channel[ch].flags|=1;
};
Fasttracker.prototype.effect_t1_5=function(mod, ch) { // 5 volslide + slide to note
  mod.effect_t1_3(mod, ch); // slide to note
  mod.effect_t1_a(mod, ch); // volslide
};
Fasttracker.prototype.effect_t1_6=function(mod, ch) { // 6 volslide + vibrato
  mod.effect_t1_4(mod, ch); // vibrato
  mod.effect_t1_a(mod, ch); // volslide
};
Fasttracker.prototype.effect_t1_7=function(mod, ch) { // 7
};
Fasttracker.prototype.effect_t1_8=function(mod, ch) { // 8 unused
};
Fasttracker.prototype.effect_t1_9=function(mod, ch) { // 9 set sample offset
};
Fasttracker.prototype.effect_t1_a=function(mod, ch) { // a volume slide
  if (!(mod.channel[ch].volslide&0x0f)) {
    // y is zero, slide up
    mod.channel[ch].voicevolume+=(mod.channel[ch].volslide>>4);
    if (mod.channel[ch].voicevolume>64) mod.channel[ch].voicevolume=64;
  }
  if (!(mod.channel[ch].volslide&0xf0)) {
    // x is zero, slide down
    mod.channel[ch].voicevolume-=(mod.channel[ch].volslide&0x0f);
    if (mod.channel[ch].voicevolume<0) mod.channel[ch].voicevolume=0;
  }
};
Fasttracker.prototype.effect_t1_b=function(mod, ch) { // b pattern jump
};
Fasttracker.prototype.effect_t1_c=function(mod, ch) { // c set volume
};
Fasttracker.prototype.effect_t1_d=function(mod, ch) { // d pattern break
};
Fasttracker.prototype.effect_t1_e=function(mod, ch) { // e
  var i=(mod.channel[ch].data&0xf0)>>4;
  mod.effects_t1_e[i](mod, ch);
};
Fasttracker.prototype.effect_t1_f=function(mod, ch) { // f
};
Fasttracker.prototype.effect_t1_g=function(mod, ch) { // g set global volume
};
Fasttracker.prototype.effect_t1_h=function(mod, ch) { // h global volume slude
  if (!(mod.globalvolslide&0x0f)) {
    // y is zero, slide up
    mod.volume+=(mod.globalvolslide>>4);
    if (mod.volume>64) mod.volume=64;
  }
  if (!(mod.globalvolslide&0xf0)) {
    // x is zero, slide down
    mod.volume-=(mod.globalvolslide&0x0f);
    if (mod.volume<0) mod.volume=0;
  }
};
Fasttracker.prototype.effect_t1_i=function(mod, ch) { // i
};
Fasttracker.prototype.effect_t1_j=function(mod, ch) { // j
};
Fasttracker.prototype.effect_t1_k=function(mod, ch) { // k key off
};
Fasttracker.prototype.effect_t1_l=function(mod, ch) { // l set envelope position
};
Fasttracker.prototype.effect_t1_m=function(mod, ch) { // m
};
Fasttracker.prototype.effect_t1_n=function(mod, ch) { // n
};
Fasttracker.prototype.effect_t1_o=function(mod, ch) { // o
};
Fasttracker.prototype.effect_t1_p=function(mod, ch) { // p panning slide
};
Fasttracker.prototype.effect_t1_q=function(mod, ch) { // q
};
Fasttracker.prototype.effect_t1_r=function(mod, ch) { // r multi retrig note
};
Fasttracker.prototype.effect_t1_s=function(mod, ch) { // s
};
Fasttracker.prototype.effect_t1_t=function(mod, ch) { // t tremor
};
Fasttracker.prototype.effect_t1_u=function(mod, ch) { // u
};
Fasttracker.prototype.effect_t1_v=function(mod, ch) { // v
};
Fasttracker.prototype.effect_t1_w=function(mod, ch) { // w
};
Fasttracker.prototype.effect_t1_x=function(mod, ch) { // x extra fine porta up/down
};
Fasttracker.prototype.effect_t1_y=function(mod, ch) { // y
};
Fasttracker.prototype.effect_t1_z=function(mod, ch) { // z
};



//
// tick 1+ effect e functions
//
Fasttracker.prototype.effect_t1_e0=function(mod, ch) { // e0
};
Fasttracker.prototype.effect_t1_e1=function(mod, ch) { // e1
};
Fasttracker.prototype.effect_t1_e2=function(mod, ch) { // e2
};
Fasttracker.prototype.effect_t1_e3=function(mod, ch) { // e3
};
Fasttracker.prototype.effect_t1_e4=function(mod, ch) { // e4
};
Fasttracker.prototype.effect_t1_e5=function(mod, ch) { // e5
};
Fasttracker.prototype.effect_t1_e6=function(mod, ch) { // e6
};
Fasttracker.prototype.effect_t1_e7=function(mod, ch) { // e7
};
Fasttracker.prototype.effect_t1_e8=function(mod, ch) { // e8
};
Fasttracker.prototype.effect_t1_e9=function(mod, ch) { // e9 retrig sample
  if (mod.tick%(mod.channel[ch].data&0x0f)==0) {
    mod.channel[ch].samplepos=0;
    mod.channel[ch].playdir=1;

    mod.channel[ch].trigramp=0.0;
    mod.channel[ch].trigrampfrom=mod.channel[ch].currentsample;

    mod.channel[ch].fadeoutpos=65535;
    mod.channel[ch].volenvpos=0;
    mod.channel[ch].panenvpos=0;
  }
};
Fasttracker.prototype.effect_t1_ea=function(mod, ch) { // ea
};
Fasttracker.prototype.effect_t1_eb=function(mod, ch) { // eb
};
Fasttracker.prototype.effect_t1_ec=function(mod, ch) { // ec cut sample
  if (mod.tick==(mod.channel[ch].data&0x0f))
    mod.channel[ch].voicevolume=0;
};
Fasttracker.prototype.effect_t1_ed=function(mod, ch) { // ed delay sample
  mod.effect_t0_ed(mod, ch);
};
Fasttracker.prototype.effect_t1_ee=function(mod, ch) { // ee
};
Fasttracker.prototype.effect_t1_ef=function(mod, ch) { // ef
};

/*
  (c) 2012-2021 Noora Halme et al. (see AUTHORS)

  This code is licensed under the MIT license:
  http://www.opensource.org/licenses/mit-license.php

  Front end wrapper class for format-specific players
*/


function Modplayer()
{
  this.supportedformats=new Array('mod', 's3m', 'xm');

  this.url="";
  this.format="s3m";

  this.state="initializing..";
  this.request=null;

  this.loading=false;
  this.playing=false;
  this.paused=false;
  this.repeat=false;

  this.separation=1;
  this.mixval=8.0;

  this.amiga500=false;

  this.filter=false;
  this.endofsong=false;

  this.autostart=false;
  this.bufferstodelay=4; // adjust this if you get stutter after loading new song
  this.delayfirst=0;
  this.delayload=0;

  this.onReady=function(){};
  this.onPlay=function(){};
  this.onStop=function(){};

  this.buffer=0;
  this.mixerNode=0;
  this.context=null;
  this.samplerate=44100;
  this.bufferlen=4096;

  this.chvu=new Float32Array(32);

  // format-specific player
  this.player=null;

  // read-only data from player class
  this.title="";
  this.signature="....";
  this.songlen=0;
  this.channels=0;
  this.patterns=0;
  this.samplenames=new Array();
}



// load module from url into local buffer
Modplayer.prototype.load = function(url)
{
  // try to identify file format from url and create a new
  // player class for it
  this.url=url;
  var ext=url.split('.').pop().toLowerCase().trim();
  if (this.supportedformats.indexOf(ext)==-1) {
    // unknown extension, maybe amiga-style prefix?
    ext=url.split('/').pop().split('.').shift().toLowerCase().trim();
    if (this.supportedformats.indexOf(ext)==-1) {
      // ok, give up
      return false;
    }
  }
  this.format=ext;

  switch (ext) {
    // case 'mod':
    //   this.player=new Protracker();
    //   break;
    // case 's3m':
    //   this.player=new Screamtracker();
    //   break;
    case 'xm':
      this.player=new Fasttracker();
      break;
  }

  this.player.onReady=this.loadSuccess;

  this.state="loading..";
  var request = new XMLHttpRequest();
  request.open("GET", this.url, true);
  request.responseType = "arraybuffer";
  this.request = request;
  this.loading=true;
  var asset = this;
  request.onprogress = function(oe) {
    asset.state="loading ("+Math.floor(100*oe.loaded/oe.total)+"%)..";
  };
  request.onload = function() {
    var buffer=new Uint8Array(request.response);
    this.state="parsing..";
    if (asset.player.parse(buffer)) {
      // copy static data from player
      asset.title=asset.player.title;
      asset.signature=asset.player.signature;
      asset.songlen=asset.player.songlen;
      asset.channels=asset.player.channels;
      asset.patterns=asset.player.patterns;
      asset.filter=asset.player.filter;
      if (asset.context) asset.setfilter(asset.filter);
      asset.mixval=asset.player.mixval; // usually 8.0, though
      asset.samplenames=new Array(32);
      for(i=0;i<32;i++) asset.samplenames[i]="";
      if (asset.format=='xm' || asset.format=='it') {
        for(i=0;i<asset.player.instrument.length;i++) asset.samplenames[i]=asset.player.instrument[i].name;
      } else {
        for(i=0;i<asset.player.sample.length;i++) asset.samplenames[i]=asset.player.sample[i].name;
      }

      asset.state="ready.";
      asset.loading=false;
      asset.onReady();
      if (asset.autostart) asset.play();
    } else {
      asset.state="error!";
      asset.loading=false;
    }
  };
  request.send();
  return true;
};




// play loaded and parsed module with webaudio context
Modplayer.prototype.play = function()
{
  if (this.loading) return false;
  if (this.player) {
    if (this.context==null) this.createContext();
    this.player.samplerate=this.samplerate;
    if (this.context) this.setfilter(this.player.filter);

    if (this.player.paused) {
      this.player.paused=false;
      return true;
    }

    this.endofsong=false;
    this.player.endofsong=false;
    this.player.paused=false;
    this.player.initialize();
    this.player.flags=1+2;
    this.player.playing=true;
    this.playing=true;

    this.chvu=new Float32Array(this.player.channels);
    for(i=0;i<this.player.channels;i++) this.chvu[i]=0.0;

    this.onPlay();

    this.player.delayfirst=this.bufferstodelay;
    return true;
  } else {
    return false;
  }
};



// pause playback
Modplayer.prototype.pause = function()
{
  if (this.player) {
    if (!this.player.paused) {
      this.player.paused=true;
    } else {
      this.player.paused=false;
    }
  }
};



// stop playback
Modplayer.prototype.stop = function()
{
  this.paused=false;
  this.playing=false;
  if (this.player) {
    this.player.paused=false;
    this.player.playing=false;
    this.player.delayload=1;
  }
  this.onStop();
};



// stop playing but don't call callbacks
Modplayer.prototype.stopaudio = function(st)
{
  if (this.player) {
    this.player.playing=st;
  }
};



// jump positions forward/back
Modplayer.prototype.jump = function(step)
{
  if (this.player) {
    this.player.tick=0;
    this.player.row=0;
    this.player.position+=step;
    this.player.flags=1+2;
    if (this.player.position<0) this.player.position=0;
    if (this.player.position >= this.player.songlen) this.stop();
  }
  this.position=this.player.position;
  this.row=this.player.row;
};



// set whether module repeats after songlen
Modplayer.prototype.setrepeat = function(rep)
{
  this.repeat=rep;
  if (this.player) this.player.repeat=rep;
};



// set stereo separation mode (0=standard, 1=65/35 mix, 2=mono)
Modplayer.prototype.setseparation = function(sep)
{
  this.separation=sep;
  if (this.player) this.player.separation=sep;
};



// set autostart to play immediately after loading
Modplayer.prototype.setautostart = function(st)
{
  this.autostart=st;
};



// set amiga model - changes lowpass filter state
Modplayer.prototype.setamigamodel = function(amiga)
{
  if (amiga=="600" || amiga=="1200" || amiga=="4000") {
    this.amiga500=false;
    if (this.filterNode) this.filterNode.frequency.value=22050;
  } else {
    this.amiga500=true;
    if (this.filterNode) this.filterNode.frequency.value=6000;
  }
};



// amiga "LED" filter
Modplayer.prototype.setfilter = function(f)
{
  if (f) {
    this.lowpassNode.frequency.value=3275;
  } else {
     this.lowpassNode.frequency.value=28867;
  }
  this.filter=f;
  if (this.player) this.player.filter=f;
};



// are there E8x sync events queued?
Modplayer.prototype.hassyncevents = function()
{
  if (this.player) return (this.player.syncqueue.length != 0);
  return false;
};



// pop oldest sync event nybble from the FIFO queue
Modplayer.prototype.popsyncevent = function()
{
  if (this.player) return this.player.syncqueue.pop();
};



// ger current pattern number
Modplayer.prototype.currentpattern = function()
{
  if (this.player) return this.player.patterntable[this.player.position];
};



// get current pattern in standard unpacked format (note, sample, volume, command, data)
// note: 254=noteoff, 255=no note
// sample: 0=no instrument, 1..255=sample number
// volume: 255=no volume set, 0..64=set volume, 65..239=ft2 volume commands
// command: 0x2e=no command, 0..0x24=effect command
// data: 0..255
Modplayer.prototype.patterndata = function(pn)
{
  var i, c, patt;
  if (this.format=='mod') {
    patt=new Uint8Array(this.player.pattern_unpack[pn]);
    for(i=0;i<64;i++) for(c=0;c<this.player.channels;c++) {
      if (patt[i*5*this.channels+c*5+3]==0 && patt[i*5*this.channels+c*5+4]==0) {
        patt[i*5*this.channels+c*5+3]=0x2e;
      } else {
        patt[i*5*this.channels+c*5+3]+=0x37;
        if (patt[i*5*this.channels+c*5+3]<0x41) patt[i*5*this.channels+c*5+3]-=0x07;
      }
    }
  } else if (this.format=='s3m') {
    patt=new Uint8Array(this.player.pattern[pn]);
    for(i=0;i<64;i++) for(c=0;c<this.player.channels;c++) {
      if (patt[i*5*this.channels+c*5+3]==255) patt[i*5*this.channels+c*5+3]=0x2e;
      else patt[i*5*this.channels+c*5+3]+=0x40;
    }
  } else if (this.format=='xm') {
    patt=new Uint8Array(this.player.pattern[pn]);
    for(i=0;i<this.player.patternlen[pn];i++) for(c=0;c<this.player.channels;c++) {
      if (patt[i*5*this.channels+c*5+0]<97)
        patt[i*5*this.channels+c*5+0]=(patt[i*5*this.channels+c*5+0]%12)|(Math.floor(patt[i*5*this.channels+c*5+0]/12)<<4);
      if (patt[i*5*this.channels+c*5+3]==255) patt[i*5*this.channels+c*5+3]=0x2e;
      else {
        if (patt[i*5*this.channels+c*5+3]<0x0a) {
          patt[i*5*this.channels+c*5+3]+=0x30;
        } else {
          patt[i*5*this.channels+c*5+3]+=0x41-0x0a;
        }
      }
    }
  }
  return patt;
};



// check if a channel has a note on
Modplayer.prototype.noteon = function(ch)
{
  if (ch>=this.channels) return 0;
  return this.player.channel[ch].noteon;
};



// get currently active sample on channel
Modplayer.prototype.currentsample = function(ch)
{
  if (ch>=this.channels) return 0;
  if (this.format=="xm" || this.format=="it") return this.player.channel[ch].instrument;
  return this.player.channel[ch].sample;
};



// get length of currently playing pattern
Modplayer.prototype.currentpattlen = function()
{
  if (this.format=="mod" || this.format=="s3m") return 64;
  return this.player.patternlen[this.player.patterntable[this.player.position]];
};



// create the web audio context
Modplayer.prototype.createContext = function()
{
  if ( typeof AudioContext !== 'undefined') {
    this.context = new AudioContext();
  } else {
    this.context = new webkitAudioContext();
  }
  this.samplerate=this.context.sampleRate;
  this.bufferlen=(this.samplerate > 44100) ? 4096 : 2048;

  // Amiga 500 fixed filter at 6kHz. WebAudio lowpass is 12dB/oct, whereas
  // older Amigas had a 6dB/oct filter at 4900Hz.
  this.filterNode=this.context.createBiquadFilter();
  if (this.amiga500) {
    this.filterNode.frequency.value=6000;
  } else {
    this.filterNode.frequency.value=22050;
  }

  // "LED filter" at 3275kHz - off by default
  this.lowpassNode=this.context.createBiquadFilter();
  this.setfilter(this.filter);

  // mixer
  if ( typeof this.context.createJavaScriptNode === 'function') {
    this.mixerNode=this.context.createJavaScriptNode(this.bufferlen, 1, 2);
  } else {
    this.mixerNode=this.context.createScriptProcessor(this.bufferlen, 1, 2);
  }
  this.mixerNode.module=this;
  this.mixerNode.onaudioprocess=Modplayer.prototype.mix;

  // patch up some cables :)
  this.mixerNode.connect(this.filterNode);
  this.filterNode.connect(this.lowpassNode);
  this.lowpassNode.connect(this.context.destination);
};



// scriptnode callback - pass through to player class
Modplayer.prototype.mix = function(ape) {
  var mod;

  if (ape.srcElement) {
    mod=ape.srcElement.module;
  } else {
    mod=this.module;
  }

  if (mod.player && mod.delayfirst==0) {
    mod.player.repeat=mod.repeat;

    var bufs=new Array(ape.outputBuffer.getChannelData(0), ape.outputBuffer.getChannelData(1));
    var buflen=ape.outputBuffer.length;
    mod.player.mix(mod.player, bufs, buflen);

    // apply stereo separation and soft clipping
    var outp=new Float32Array(2);
    for(var s=0;s<buflen;s++) {
      outp[0]=bufs[0][s];
      outp[1]=bufs[1][s];
    
      // a more headphone-friendly stereo separation
      if (mod.separation) {
        t=outp[0];
        if (mod.separation==2) { // mono
          outp[0]=outp[0]*0.5 + outp[1]*0.5;
          outp[1]=outp[1]*0.5 + t*0.5;
        } else { // narrow stereo
          outp[0]=outp[0]*0.65 + outp[1]*0.35;
          outp[1]=outp[1]*0.65 + t*0.35;
        }
      }

      // scale down and soft clip
      outp[0]/=mod.mixval; outp[0]=0.5*(Math.abs(outp[0]+0.975)-Math.abs(outp[0]-0.975));
      outp[1]/=mod.mixval; outp[1]=0.5*(Math.abs(outp[1]+0.975)-Math.abs(outp[1]-0.975));
      
      bufs[0][s]=outp[0];
      bufs[1][s]=outp[1];
    }

    mod.row=mod.player.row;
    mod.position=mod.player.position;
    mod.speed=mod.player.speed;
    mod.bpm=mod.player.bpm;
    mod.endofsong=mod.player.endofsong;

    if (mod.player.filter != mod.filter) {
      mod.setfilter(mod.player.filter);
    }

    if (mod.endofsong && mod.playing) mod.stop();

    if (mod.delayfirst>0) mod.delayfirst--;
    mod.delayload=0;
    
    // update this.chvu from player channel vu
    for(var i=0;i<mod.player.channels;i++) {
      mod.chvu[i]=mod.chvu[i]*0.25 + mod.player.chvu[i]*0.75;    
      mod.player.chvu[i]=0.0;
    }
  }


};

var laser = [.2,,10,.12,.01,.05,,1.2,,,-491,.02,,,119,.7,,.93,.02,,-1430];

const ctx = setContext(document.getElementById('c').getContext('2d', { willReadFrequently: true }));
ctx.imageSmoothingEnabled = false;
ctx.setTransform(1, 0, 0, 1, 0, 0);

(async () => {
  initKeys();

  await loadData('song1', zzfxm, song1);
  await loadData('explosion', zzfxG, explosion);
  await loadData('shoot', zzfxG, shoot);
  await loadData('shoot2', zzfxG, shoot2);
  await loadData('typing', zzfxG, typing);
  await loadData('powerup', zzfxG, powerup);
  await loadData('hit', zzfxG, hit);
  await loadData('transition', zzfxG, transition);
  await loadData('engineSlowdown', zzfxG, engineSlowdown);
  await loadData('bigExplosion', zzfxG, bigExplosion);
  await loadData('laser', zzfxG, laser);
  // await loadImage('font.png');
  await loadImage('spritesheet.png');
  await loadImage('spritesheet16.png');

  const titleImage = title();
  await titleImage.generate(256, 240);
  await loadImage('title.png', titleImage.image);

  const gameOverImage = gameOver();
  await gameOverImage.generate(256, 240);
  await loadImage('gameover.png', gameOverImage.image);

  const saturnImage = await saturn();
  await saturnImage.generate(256, 240);
  await loadImage('saturn.png', saturnImage.image);

  let fontImage = await font();
  await fontImage.generate(378, 9);
  await loadImage('font-white.png', fontImage.image);
  fontImage = await font('yellow');
  await fontImage.generate(378, 9);
  await loadImage('font-yellow.png', fontImage.image);
  fontImage = await font('red');
  await fontImage.generate(378, 9);
  await loadImage('font-red.png', fontImage.image);
  fontImage = await font('green');
  await fontImage.generate(378, 9);
  await loadImage('font-green.png', fontImage.image);
  fontImage = await font('lightgreen');
  await fontImage.generate(378, 9);
  await loadImage('font-lightgreen.png', fontImage.image);
  fontImage = await font('gray');
  await fontImage.generate(378, 9);
  await loadImage('font-gray.png', fontImage.image);
  fontImage = await font('lightblue');
  await fontImage.generate(378, 9);
  await loadImage('font-lightblue.png', fontImage.image);

  onKey('m', () => {
    if (player.playing) {
      player.stop();      
    } else {
      player.play();
    }
  });

  function changeScene(scene, props = {}) {
    clearEvents(['change-scene']);

    switch (scene) {
      case 'menu':
        player.load('./menu.xm');
        currentScene = menuScene();
        break;
      case 'game':
        player.load('./music-1.xm');
        currentScene = gameScene();
        break;
      case 'game-over':
        player.load('./game-over.xm');
        currentScene = gameOverScene(props);
        break;
    }
  }

  const player = new Modplayer();
  player.setrepeat(true);
  player.onReady = () => player.play();

  on('change-scene', (scene, props) => changeScene(scene, props));
  on('song-end', () => console.log('song-end'));

  let currentScene = loadingScene();
  // let overlayScene = playerScene();

  const loop = gameLoop({
    update(dt) {
      currentScene.update(dt);
      // currentScene.id !== 'loading' && overlayScene.update(dt);
    },
    render() {
      currentScene.render();
      // currentScene.id !== 'loading' && overlayScene.render();
    }
  });

  loop.start();

})();
