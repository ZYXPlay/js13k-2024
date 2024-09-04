(function () {
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

  let imageAssets = {};

  function getUrl(url, base) {
    return new URL(url, base).href;
  }

  function addGlobal() {
    if (!window.__k) {
      window.__k = {
        u: getUrl,
        i: imageAssets
      };
    }
  }

  function loadImage(url) {
    addGlobal();

    return new Promise((resolve, reject) => {
      let image, fullUrl;

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

  function gameObject ({
    name = '',
    x = -100,
    y = -100,
    dx = 0,
    dy = 0,
    ddx = 0,
    ddy = 0,
    width = 10,
    height = 10,
    scaleX = 1,
    scaleY = 1,
    rotation = 0,
    anchor = {x:.5,y:.5},
    ttl = Infinity,
    color = 'white',
    init,
    update,
    render,
    draw,
    image,
  } = {}) {
    const object = {
      init(properties = {}) {
        Object.assign(this, properties);
        this._if && this._if();
      },
      advance() {
        this.x += this.dx;
        this.y += this.dy;
        this.dx += this.ddx;
        this.dy += this.ddy;
      },
      _update() {
        this.advance();
        this.frame++;
        this.ttl--;
      },
      update() {
        if (this._uf) {
          this._uf();
          return;
        }
        this._update();
      },
      _render() {
        const { context: ctx } = this;
        ctx.translate(this.x, this.y);
        this.rotation && ctx.rotate(this.rotation);
        this.scaleX && this.scaleY && ctx.scale(this.scaleX, this.scaleY);
        ctx.translate(-this.width * anchor.x, -this.width * anchor.y);
        this.draw();
      },
      render() {
        const { context: ctx } = this;

        ctx.save();
        if (this._rf) {
          ctx.translate(this.x, this.y);
          this._rf();
          return;
        }
        this._render();
        ctx.restore();
      },
      _draw() {
        const { context: ctx } = this;
        if (this._df) return this._df();
        ctx.fillStyle = this.color || 'white';
        ctx.fillRect(0, 0, this.width, this.height);
      },
      draw() {
        if (this._df) {
          this._df();
          return;
        }
        this._draw();
      },
      isAlive() {
        return this.ttl > 0;
      },
      ...arguments[0],
    };

    object.init({
      name,
      x,
      y,
      dx,
      dy,
      ddx,
      ddy,
      width,
      height,
      scaleX,
      scaleY,
      rotation,
      anchor,
      ttl,
      color,
      frame: 0,
      context: getContext(),
      _if: init,
      _uf: update,
      _rf: render,
      _df: draw,
      image,
    });

    return object;
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

  let // ZzFXMicro - Zuper Zmall Zound Zynth - v1.3.1 by Frank Force ~ 1000 bytes
  zzfxV=.3,               // volume
  zzfxX=new AudioContext, // audio context
  zzfx=                   // play sound
  (p=1,k=.05,b=220,e=0,r=0,t=.1,q=0,D=1,u=0,y=0,v=0,z=0,l=0,E=0,A=0,F=0,c=0,w=1,m=0,B=0
  ,N=0)=>{let M=Math,d=2*M.PI,R=44100,G=u*=500*d/R/R,C=b*=(1-k+2*k*M.random(k=[]))*d/R,
  g=0,H=0,a=0,n=1,I=0,J=0,f=0,h=N<0?-1:1,x=d*h*N*2/R,L=M.cos(x),Z=M.sin,K=Z(x)/4,O=1+K,
  X=-2*L/O,Y=(1-K)/O,P=(1+h*L)/2/O,Q=-(h+L)/O,S=P,T=0,U=0,V=0,W=0;e=R*e+9;m*=R;r*=R;t*=
  R;c*=R;y*=500*d/R**3;A*=d/R;v*=d/R;z*=R;l=R*l|0;p*=zzfxV;for(h=e+m+r+t+c|0;a<h;k[a++]
  =f*p)++J%(100*F|0)||(f=q?1<q?2<q?3<q?Z(g**3):M.max(M.min(M.tan(g),1),-1):1-(2*g/d%2+2
  )%2:1-4*M.abs(M.round(g/d)-g/d):Z(g),f=(l?1-B+B*Z(d*a/l):1)*(f<0?-1:1)*M.abs(f)**D*(a
  <e?a/e:a<e+m?1-(a-e)/m*(1-w):a<e+m+r?w:a<h-c?(h-a-c)/t*w:0),f=c?f/2+(c>a?0:(a<h-c?1:(
  h-a)/c)*k[a-c|0]/2/p):f,N?f=W=S*T+Q*(T=U)+P*(U=f)-Y*V-X*(V=W):0),x=(b+=u+=y)*M.cos(A*
  H++),g+=x+x*E*Z(a**5),n&&++n>z&&(b+=v,C+=v,n=0),!l||++I%l||(b=C,u=G,n=n||1);p=zzfxX.
  createBuffer(1,h,R);p.getChannelData(0).set(k);b=zzfxX.createBufferSource();
  b.buffer=p;b.connect(zzfxX.destination);b.start();};

  function createEnemy (props = {}) {
    const explosionColors = ['pink', 'orange', 'white', 'purple', 'red', 'cyan', 'green', 'yellow', 'pink', 'orange'];
    return gameObject({
      name: 'enemy',
      x: -80,
      y: -80,
      image: imageAssets['spritesheet.png'],
      image16: imageAssets['spritesheet16.png'],
      sprite: 4,
      fireTimer: 0,
      hitTimer: 0,
      frame: 0,
      scaleX: 0.1,
      scaleY: 0.1,
      shield: 2,
      maxShield: 2,
      imune: true,
      dying: false,
      parent: props.parent,
      anglePlacement: props.anglePlacement || 0,
      isBoss: false,
      bossRadius: 30,
      bossSpeed: 40,
      fireMode: 0,
      ...props,
      hit(damage) {
        this.shield -= damage;
        this.hitTimer = 1;
        this.shield <= 0 && !this.dying && this.die();
        zzfx(...[2.3,,330,,.06,.17,2,3.7,,,,,.05,.4,2,.5,.13,.89,.05,.17]); // Hit 56
      },
      die() {
        this.wave && this.wave.killed++;
        this.parent && this.parent.childrenKilled++;
        this.imune = true;
        this.dying = true;
        this.ttl = 10;
      },
      update() {
        const xy = this.path.getPointAtLength(this.frame);
        const nextXy = this.path.getPointAtLength(this.frame + 1);

        this.x = Math.floor(xy.x);
        this.y = Math.floor(xy.y);

        if (this.parent) {
          this.x = this.parent.x + Math.cos(this.frame / this.parent.bossSpeed + this.anglePlacement) * this.parent.bossRadius;
          this.y = this.parent.y + Math.sin(this.frame / this.parent.bossSpeed + this.anglePlacement) * this.parent.bossRadius;
        }

        this.hitTimer > 4 && (this.hitTimer = 0);

        this.rotate && (this.rotation = degToRad(90) + (angleToTarget(xy, nextXy)));
        !this.rotate && (this.rotation = degToRad(180));

        if (this.frame >= this.path.getTotalLength()) {
          this.frame = 0;
          !this.loop && (this.wave && this.wave.killed++, this.ttl = 0);
        }
    
        let scale = clamp(0, 1, this.frame / 50);
        this.frame < 50 && (
          scale = this.frame / 50
        );
        this.frame > this.path.getTotalLength() - 50 && (
          scale = (this.path.getTotalLength() - this.frame) / 50
        );
        this.frame == 50 && (this.imune = false);

        this.scaleX = this.scaleY = scale;

        this.fireMode !== 2 && Math.random() > 0.995 && emit('enemy-fire', this, this.fireMode);

        if (this.fireMode === 2 && (this.fireTimer == 20 || this.fireTimer == 40 || this.fireTimer == 60)) {
          emit('enemy-fire', this, this.fireMode);
        }
        this.fireTimer > 300 && (this.fireTimer = 0);

        this.hitTimer > 0 && this.hitTimer++;
        this.frame > 50 && this.fireTimer++;

        if (this.isBoss && this.fireTimer > 10 && this.fireTimer < 70) {
          this.imune = false;
        } else if (this.isBoss) {
          this.imune = true;
        }

        this.fireMode === 2 && (this.fireTimer < 10 || this.fireTimer > 70) && this._update();
        this.fireMode !== 2 && this._update();

        this.ttl <= 0 && this.dying && (emit('explosion', this.x, this.y, this.isBoss ? 60 : 20, this.isBoss ? 10 : 5, explosionColors[this.sprite]));
      },
      draw() {
        const { context: ctx } = this;
        // @todo drawing only after frame 1 to avoid scale flickering
        this.frame > 1 && !this.isBoss && ctx.drawImage(this.image, 8 * this.sprite, 0, 8, 8, 0, 0, 8, 8);
        this.frame > 1 && this.isBoss && ctx.drawImage(this.image16, 16 * this.sprite, 0, 16, 16, 0, 0, 16, 16);

        if (this.frame > 1 && this.isBoss) {
          const bar = 20 * this.shield / this.maxShield;
          ctx.save();
          // ctx.scale(2-this.scaleX, 2-this.scaleY);
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

        if (this.hitTimer) {
          ctx.globalCompositeOperation = "source-atop";
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, this.isBoss ? 16 : 8, this.isBoss ? 16 : 8);
          ctx.globalCompositeOperation = "source-over";
        }
      }
    });
  }

  var l01 = [ // waves
    [ // wave
      100, // start at frame
      false, // wait for previous wave
      4, // enemy type
      false, // rotate
      1, // shield
      2, // total
      330, // interval
      false, // loop
      0, // mode
      'M1 1s162 189 172 199c11 10 30 35 59 24 29-12 9-54 0-65L120 37S99 11 71 15c-27 3-46 47-46 47S4 106 4 126s-3 67 11 77c15 10 55 41 79 9L247 1', // path
      [ // dialogs
        [ // dialog
          99, // frame
          0, // character
          true, // pause gameplay
          [ // texts
            'CAPTAIN',
            'WE HAVE DETECTED',
            'SOME ENEMY SCOUTS',
            'A FULL WAVE IS IMINENT',
            '    ',
            'PROCEED WITH CAUTION',
            'AND GOOD LUCK!'
          ],
        ],
        [ // dialog
          420, // frame
          0, // character
          true, // pause gameplay
          [ // texts
            'WE DEPLOYED SOME POWERUPS',
            '',
            'TO ENHANCE YOUR FIRE POWER',
            'AND RECHARGE YOUR SHIELD',
          ],
        ],
      ],
      [ // powerups
        [ // powerup
          410, // frame
          120, // x
          1, // speed
          0, // type
          10, // value
        ],
        [ // powerup
          730, // frame
          200, // x
          1, // speed
          1, // type
          10, // value
        ],
      ],
    ],
    [
      400, // start at frame
      true, // wait for previous wave
      5, // enemy type
      true, // rotate
      2, // shield
      3, // total
      60, // interval
      false, // loop
      0, // mode
      'M113.696 117.212C128.254 117.212 156.71 108.752 154.725 91.832C152.74 74.9117 136.196 52.5529 113.696 52.5529C91.1957 52.5529 64.7252 64.0345 54.7988 79.7461C44.8723 95.4577 38.9165 134.737 54.7988 152.261C70.6811 169.786 80.6075 172.807 105.755 172.203C130.902 171.599 155.387 160.117 170.607 149.24C185.828 138.363 203.034 112.378 202.372 91.832C201.71 71.286 207.004 45.9058 189.798 28.3813C172.593 10.8567 149.431 -0.625112 98.4751 1.18777C47.5194 3.00065 40.9017 23.5468 30.3135 38.0498C19.7253 52.5529 2.51948 78.5374 1.19596 112.378C-0.127568 146.219 5.16655 173.412 19.7253 189.728C34.2841 206.044 72.0046 225.381 98.4751 225.985C124.946 226.59 177.887 208.461 194.431 194.562C210.975 180.663 232.813 157.7 238.107 128.09C243.401 98.4791 244.725 70.6818 232.813 52.5529C220.901 34.424 207.666 18.7631 165.313 10.9072C122.96 3.05134 87.8869 18.1082 70.6811 31.4026C53.4752 44.697 19.7253 83.3718 19.7253 112.378C19.7253 141.384 25.6812 165.556 54.7988 186.102C83.9163 206.648 148.107 193.353 167.96 180.663C187.813 167.973 214.284 149.24 218.916 117.212C223.548 85.1847 199.725 59.2001 173.916 46.5099C148.107 33.8198 105.755 33.2155 83.9163 46.5099C62.0781 59.8043 40.24 93.0406 56.7841 128.09C73.3281 163.139 99.1369 163.139 115.681 156.492C132.225 149.844 167.96 141.384 173.916 112.378C179.872 83.3718 177.887 66.4517 142.151 59.2001C106.416 51.9485 79.284 62.2217 79.284 93.6449C79.284 125.068 98.4751 117.212 98.4751 117.212', // path
      [],
      [],
    ],
  ];

  var l02 = [ // waves
    [ // wave
      200, // start at frame
      false, // wait for previous wave
      0, // enemy type
      false, // rotate
      10, // shield
      1, // total
      50, // interval
      true, // loop
      2, // fire mode
      'M131 57s-56 130 0 129c57 0 99-32 69-67s-33-85-69-75-71 38-71 75c1 37 25 52 64 51 39 0 61-22 60-51-1-30-21-46-47-47-25-1-56 17-56 47 0 29 12 32 43 29s39-11 39-29-6-25-26-25-32 4-36 25c-3 20 9 18 23 11 13-7 17-11 17-11', // path
      // 'M244 12H22c-14 0-11 9 0 9h214c17 0 17 10 0 10H22C4 31 8 43 22 43h214c20 0 19 15 0 15H22C6 58 6 71 22 71h244', // path
      [ // dialogs
        [ // dialog
          99, // frame
          0, // character
          true, // pause gameplay
          [ // texts
            'SOMETHING BIG IS COMING',
          ],
        ],
      ],
      [ // powerups
        [ // powerup
          200, // frame
          120, // x
          .5, // speed
          0, // type
          10, // value
        ],
        [ // powerup
          400, // frame
          200, // x
          .5, // speed
          1, // type
          10, // value
        ],
        [ // powerup
          1600, // frame
          200, // x
          .5, // speed
          0, // type
          10, // value
        ],
        [ // powerup
          2900, // frame
          120, // x
          .5, // speed
          0, // type
          10, // value
        ],
      ],
      [ // children
        [ // child
          8, // enemy type
          false, // rotate
          1, // shield
          4, // total
          0, // fire mode
        ],
      ],
    ],
  ];

  var l03 = [ // waves
    [ // wave
      100, // start at frame
      false, // wait for previous wave
      4, // enemy type
      false, // rotate
      1, // shield
      2, // total
      330, // interval
      false, // loop
      0, // mode
      'M1 1s162 189 172 199c11 10 30 35 59 24 29-12 9-54 0-65L120 37S99 11 71 15c-27 3-46 47-46 47S4 106 4 126s-3 67 11 77c15 10 55 41 79 9L247 1', // path
      [ // dialogs
      ],
      [ // powerups
        [ // powerup
          410, // frame
          120, // x
          1, // speed
          0, // type
          10, // value
        ],
        [ // powerup
          730, // frame
          200, // x
          1, // speed
          1, // type
          10, // value
        ],
      ],
    ],
    [
      400, // start at frame
      true, // wait for previous wave
      5, // enemy type
      true, // rotate
      2, // shield
      3, // total
      60, // interval
      false, // loop
      0, // mode
      'M113.696 117.212C128.254 117.212 156.71 108.752 154.725 91.832C152.74 74.9117 136.196 52.5529 113.696 52.5529C91.1957 52.5529 64.7252 64.0345 54.7988 79.7461C44.8723 95.4577 38.9165 134.737 54.7988 152.261C70.6811 169.786 80.6075 172.807 105.755 172.203C130.902 171.599 155.387 160.117 170.607 149.24C185.828 138.363 203.034 112.378 202.372 91.832C201.71 71.286 207.004 45.9058 189.798 28.3813C172.593 10.8567 149.431 -0.625112 98.4751 1.18777C47.5194 3.00065 40.9017 23.5468 30.3135 38.0498C19.7253 52.5529 2.51948 78.5374 1.19596 112.378C-0.127568 146.219 5.16655 173.412 19.7253 189.728C34.2841 206.044 72.0046 225.381 98.4751 225.985C124.946 226.59 177.887 208.461 194.431 194.562C210.975 180.663 232.813 157.7 238.107 128.09C243.401 98.4791 244.725 70.6818 232.813 52.5529C220.901 34.424 207.666 18.7631 165.313 10.9072C122.96 3.05134 87.8869 18.1082 70.6811 31.4026C53.4752 44.697 19.7253 83.3718 19.7253 112.378C19.7253 141.384 25.6812 165.556 54.7988 186.102C83.9163 206.648 148.107 193.353 167.96 180.663C187.813 167.973 214.284 149.24 218.916 117.212C223.548 85.1847 199.725 59.2001 173.916 46.5099C148.107 33.8198 105.755 33.2155 83.9163 46.5099C62.0781 59.8043 40.24 93.0406 56.7841 128.09C73.3281 163.139 99.1369 163.139 115.681 156.492C132.225 149.844 167.96 141.384 173.916 112.378C179.872 83.3718 177.887 66.4517 142.151 59.2001C106.416 51.9485 79.284 62.2217 79.284 93.6449C79.284 125.068 98.4751 117.212 98.4751 117.212', // path
      [],
      [],
    ],

    [
      600, // start at frame
      true, // wait for previous wave
      6, // enemy type
      true, // rotate
      4, // shield
      3, // total
      200, // interval
      false, // loop
      0, // mode
      'M241 228V23c0-29-40-29-40 0v186c0 36-30 25-37 0S140 7 116 7 82 168 77 206c-5 37-38 29-38 0V33C39-11 1-7 1 33v195', // path
      [],
      [],
    ],

    [
      800, // start at frame
      true, // wait for previous wave
      7, // enemy type
      false, // rotate
      4, // shield
      3, // total
      20, // interval
      false, // loop
      0, // mode
      'M235 1H13c-14 0-11 9 0 9h214c17 0 17 10 0 10H13c-18 0-14 12 0 12h214c20 0 19 15 0 15H13c-16 0-16 13 0 13h244', // path
      [],
      [],
    ],
  ];

  var l04 = [ // waves
    [ // wave
      200, // start at frame
      false, // wait for previous wave
      0, // enemy type
      false, // rotate
      20, // shield
      1, // total
      50, // interval
      true, // loop
      2, // fire mode
      'M131 57s-56 130 0 129c57 0 99-32 69-67s-33-85-69-75-71 38-71 75c1 37 25 52 64 51 39 0 61-22 60-51-1-30-21-46-47-47-25-1-56 17-56 47 0 29 12 32 43 29s39-11 39-29-6-25-26-25-32 4-36 25c-3 20 9 18 23 11 13-7 17-11 17-11', // path
      // 'M244 12H22c-14 0-11 9 0 9h214c17 0 17 10 0 10H22C4 31 8 43 22 43h214c20 0 19 15 0 15H22C6 58 6 71 22 71h244', // path
      [ // dialogs
        [ // dialog
          50, // frame
          0, // character
          true, // pause gameplay
          [ // texts
            'REMEMBER',
            'THE BIG SHIP CAN ONLY BE HIT',
            'WHEN SHOOTING',
          ],
        ],
      ],
      [ // powerups
        [ // powerup
          200, // frame
          120, // x
          .5, // speed
          0, // type
          10, // value
        ],
        [ // powerup
          400, // frame
          200, // x
          .5, // speed
          1, // type
          10, // value
        ],
        [ // powerup
          1600, // frame
          200, // x
          .5, // speed
          0, // type
          10, // value
        ],
        [ // powerup
          2900, // frame
          120, // x
          .5, // speed
          0, // type
          10, // value
        ],
      ],
      [ // children
        [ // child
          8, // enemy type
          true, // rotate
          2, // shield
          8, // total
          1, // fire mode
        ],
      ],
    ],
  ];

  const levels = [l01, l02, l03, l04];

  function getLevel(level, virtualLevel) {
    return parseLevel(levels[level - 1], virtualLevel);
  }

  const totalLevels = levels.length;

  function parseDialog(dialog) {
    const [frame, character, pause, texts] = dialog;
    return {
      frame,
      character,
      pause,
      texts,
    };
  }

  function parsePowerup(powerup) {
    const [frame, x, speed, type, value] = powerup;
    return {
      frame,
      x,
      speed,
      type,
      value,
    };
  }

  function parseLevel(level, virtualLevel) {
    const waves = [];

    level.forEach((wave) => {
      const [frame, previous, sprite, rotate, shield, total, interval, loop, fireMode, path, dialogs, powerups, children = []] = wave;
      waves.push({
        frame,
        previous,
        sprite,
        rotate,
        shield,
        total: children.length > 0 ? total : total + Math.floor(virtualLevel / 4),
        interval,
        loop,
        fireMode,
        path: createPath(path),
        dialogs: dialogs.map(parseDialog),
        powerups: powerups.map(parsePowerup),
        count: 0,
        completed: false,
        killed: 0,
        children,
      });
    });

    return { waves };
  }

  function pool({
    create,
    maxSize = 10,
  }) {
    return {
      objects: [create({x:-100, y:-100})],
      maxSize,
      size: 0,
      _c: create,
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
      },  
      update() {
        let obj;
        let doSort = false;
        for (let i = this.size; i--; ) {
          obj = this.objects[i];
    
          obj.update();
    
          if (!obj.isAlive()) {
            doSort = true;
            this.size--;
          }
        }
        // sort all dead elements to the end of the pool
        if (doSort) {
          this.objects.sort((a, b) => b.isAlive() - a.isAlive());
        }
      },
      render() {
        for (let i = this.size; i--; ) {
          this.objects[i].render();
        }  
      },
      getAliveObjects() {
        return this.objects.slice(0, this.size);
      }
    }
  }

  function scene ({
    objects = [],
    update,
    render,
  }) {
    const scene = {
      ...arguments[0],
      init(properties = {}) {
        Object.assign(this, properties);
      },
      update() {
        if (this._uf) { this._uf(); return; }      this.objects.forEach(object => object.update());
      },
      render() {
        if (this._rf) { this._rf(); }      this.objects.forEach(object => object.render());
      },
    };

    scene.init({
      objects,
      context: getContext(),
      _uf: update,
      _rf: render,
    });

    return scene;
  }

  function createShip() {
    const ctx = getContext();

    return gameObject({
      name: 'ship',
      x: ctx.canvas.width / 2,
      y: ctx.canvas.height + 16,
      image: imageAssets['spritesheet.png'],
      sprite: 1,
      fireTimer: 0,
      fireLevel: 0,
      hitTimer: 0,
      imune: true,
      dying: false,
      spawning: true,
      shield: 100,
      lives: 3,
      score: 0,
      hit(damage) {
        if (this.imune) return;
        this.shield -= damage;
        this.hitTimer = 1;
        this.shield <= 0 && this.die();
        zzfx(...[2.3, , 330, , .06, .17, 2, 3.7, , , , , .05, .4, 2, .5, .13, .89, .05, .17]); // Hit 56
      },
      die() {
        if (this.dying) return;
        this.imune = true;
        this.dying = true;
        this.lives--;
        this.ttl = 5;
        if (this.lives <= 0) {
          emit('game-over');
          return;
        }
      },
      spawn() {
        this.x = ctx.canvas.width / 2;
        this.y = ctx.canvas.height + 32;
        this.scaleX = 2;
        this.scaleY = 2;
        this.shield = 100;
        this.fireLevel = 0;
        this.imune = true;
        this.dying = false;
        this.spawning = true;
        this.ttl = Infinity;
        this.frame = 0;
        this.ddy = 0;
        this.dy = 0;
      },
      firePowerup(value) {
        this.fireLevel++;
        this.fireLevel > 3 && (this.fireLevel = 3);
      },
      shieldPowerup(value) {
        this.shield = 100;
      },
      update() {
        const friction = .96;

        this.ddx = 0;
        this.ddy = 0;

        this.dx *= friction;
        this.dy *= friction;

        this.sprite = 1;

        keyPressed('arrowright') && this.dx < 5 && (this.ddx = .2, this.sprite = 2);
        keyPressed('arrowleft') && this.dx > -5 && (this.ddx = -.2, this.sprite = 0);

        if (keyPressed('space') && this.fireTimer % (15 / (this.fireLevel > 1 ? 2 : 1)) === 0) {
          if (this.fireLevel == 0) {
            emit('ship-fire', this.x - 1);
          } else if (this.fireLevel == 1) {
            emit('ship-fire', this.x - 2, 1);
            emit('ship-fire', this.x + 2, 1);
          } else if (this.fireLevel == 2) {
            emit('ship-fire', this.x - 3, 1);
            setTimeout(() => emit('ship-fire', this.x - 1, 2), 200);
            emit('ship-fire', this.x + 3, 1);
          } else if (this.fireLevel == 3) {
            emit('ship-fire', this.x - 2, 1);
            setTimeout(() => emit('ship-fire', this.x + 2, 1), 300);
            setTimeout(() => emit('ship-fire', this.x - 4, 2), 200);
            setTimeout(() => emit('ship-fire', this.x + 4, 2), 100);
          }
        }

        if (!this.spawning) {
          keyPressed('arrowdown') && this.dy < 5 && (this.ddy = .2);
          keyPressed('arrowup') && this.dy > -5 && (this.ddy = -.2);
        }

        this.frame < 100 && (this.ddy = -.03, this.scaleX = this.scaleY = 2 - this.frame / 100);

        this.lives <= 0 && (this.ddx = 0, this.ddy = 0, this.dx = 0, this.dy = 0);
        this.hitTimer > 4 && (this.hitTimer = 0);
        this._update();

        this.x > ctx.canvas.width && (this.x = ctx.canvas.width);
        this.x < 0 && (this.x = 0);
        this.lives > 0 && !this.spawning && this.y > ctx.canvas.height && (this.y = ctx.canvas.height);
        this.y < 0 && (this.y = 0);

        this.shield <= 0 && this.die();
        this.ttl <= 0 && (emit('explosion', this.x, this.y, 30, 6, 'white'), this.spawn());

        this.frame == 100 && (this.imune = false, this.spawning = false);

        this.fireTimer++;
        this.hitTimer > 0 && this.hitTimer++;
      },
      draw() {
        const { context: ctx } = this;
        ctx.drawImage(this.image, 8 * this.sprite, 0, 8, 8, 0, 0, 8, 8);

        if (this.frame < 100 && this.imune && this.frame % 20 < 10) {
          ctx.globalCompositeOperation = "source-atop";
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, 8, 8);
          ctx.globalCompositeOperation = "source-over";
        }

        if (this.hitTimer) {
          ctx.globalCompositeOperation = "source-atop";
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, 8, 8);
          ctx.globalCompositeOperation = "source-over";
        }

        let boost = 1;
        this.ddy < 0 && (boost = this.frame % 10 < 5 ? 2 : 3);
        ctx.fillStyle = '#FFaa33';
        ctx.fillRect(3, 7, 2, boost);
        ctx.fillStyle = '#FF6633';
        ctx.fillRect(this.frame % 10 < 5 ? 3 : 4, 7 + boost, 1, boost);
      }
    });
  }

  function text({
    id = 'text',
    x = 0,
    y = 0,
    text = '',
    color = 'white',
    align = 'left',
    lineHeight = 8,
    scale = 1,
  }) {
    const context = getContext();
    const texts = text.split('\n');
    const maxText = texts.reduce((a, b) => a.length > b.length ? a : b);
    const width = maxText.length * 8;
    const height = 8;

    return gameObject({
      x,
      y,
      width,
      height,
      anchor: { x: 0, y: 0 },
      text,
      scaleX: scale,
      scaleY: scale,
      draw() {
        const font = imageAssets['font.png'];
        const charWidth = 8;
        const charHeight = 8;
        const texts = this.text.split('\n');

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

            const sx = index * charWidth,
              sy = 0,
              sw = charWidth,
              sh = charHeight,
              dx = i * charWidth,
              dy = 0,
              dw = charWidth,
              dh = charHeight;

            context.drawImage(font, sx, sy, sw, sh, dx, dy, dw, dh);
            context.globalCompositeOperation = "source-atop";
            context.fillStyle = color || "white";
            context.fillRect(dx, 0, charWidth, charHeight);
            context.globalCompositeOperation = "source-over";
          }

          context.restore();
          context.translate(0, lineHeight);
        });
        context.restore();
      },
    });
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

  function starfield() {
    const ctx = getContext();
    const starPool = pool({
      create: gameObject,
      maxSize: 300,
    });

    function createStar(y) {
      const starVel = (Math.random() * 2) + .1;
      const starColor = 0 + starVel * 96;

      starPool.get({
        id: 'star',
        x: Math.random() * ctx.canvas.width,
        y,
        dx: 0,
        dy: starVel,
        width: 1,
        height: 1,
        ttl: 240 / starVel,
        update() {
          this.advance();
          this.y > ctx.canvas.height && (this.ttl = 0);
        },
        draw() {
          const { context: ctx } = this;
          ctx.fillStyle = `rgb(${starColor}, ${starColor}, ${starColor})`;
          ctx.fillRect(0, 0, this.width, this.height);
        },
      });
    }
    for (let y = 0; y < ctx.canvas.height; y += 2) {
      createStar(y);
    }

    return {
      update() {
        createStar(-1);
        starPool.update();
      },
      render() {
        starPool.render();
      },
    };
  }

  function createDialog ({x = 8, y = 8}) {
    // const synth = window.speechSynthesis;
    // const voice = synth.getVoices().filter(voice => voice.name === 'Grandpa (English (UK))')[0];
    // // Grandpa (English (UK))
    // // Fred (en-US)
    // let utterThis;

    return gameObject({
      name: 'dialog',
      x: 8,
      y: 248,
      image: imageAssets['spritesheet.png'],
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
      skip() {
        this.textIndex = this.texts[this.textsIndex].length;
      },
      start(dialog) {
        onKey(['space'], () => this.skip());
        this.stopping = false;
        setTimeout(() => {
          this.isTalking = true;
          this.texts = ['', ...dialog.texts];
          this.frame = 0;
        }, 2000);
        this.dy = -2;
      },
      stop() {
        offKey(['space']);
        this.stopping = true;
        this.text.text = '        ';
        this.isTalking = false;
        setTimeout(() => {
          this.texts = [];
          this.textsIndex = 0;
          this.textIndex = 0;
          this.frame = 0;
        }, 1000);
        this.dy = 2;
      },
      update() {
        this.y < 200 && (this.dy = 0, this.y = 200);
        this.y > 248 && (this.dy = 0, this.y = 248);
        if (this.texts.length == 0) return;
        this.talking = false;
        let t = this.texts[this.textsIndex] + '      ';
        t[this.textIndex] !== ' ' && (this.talking = true);
        this.frame % 5 == 0 && (this.textIndex++, t[this.textIndex] !== ' ' && zzfx(...[1.5,,261,.01,.02,.08,1,1.5,-0.5,,,-0.5,,,,,.9,.05]));
        this.textsIndex < this.texts.length && (this.text.text = t.slice(0, this.textIndex));
        this.frame++;
        if (this.textIndex >= t.length) {      
          this.textsIndex++;
          this.frame = 0;
          this.textIndex = 0;

          // if (this.textsIndex < this.texts.length) {
          //   let utterThis = new SpeechSynthesisUtterance(this.texts[this.textsIndex]);
          //   utterThis.lang = 'en-US';
          //   utterThis.pitch = 1.2;
          //   utterThis.rate = 0.8;
          //   utterThis.volume = 1;
          //   utterThis.voice = voice;
          //   synth.speak(utterThis);
          // }

        }      this.textsIndex >= this.texts.length && (!this.stopping && this.stop());
        this.talking && (this.frame % 5 == 0 && this.spriteIndex++);
        this.spriteIndex >= this.sprites.length && (this.spriteIndex = 0);
        this._update();
      },
      draw() {
        const { context: ctx, image } = this;
        ctx.fillStyle = 'white';
        ctx.fillRect(-2, -2, 12, 12);
        ctx.drawImage(image, this.sprites[this.spriteIndex] * 8, 0, 8, 8, 0, 0, 8, 8);
        ctx.translate(16, 0);
        this.text.draw();
      },
    });
  }

  function createEnemyBullet (props = {}) {
    return gameObject({
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      width: 2,
      height: 2,
      ttl: 400,
      frame: 0,
      die() {
        this.ttl = 0;
        this.x = -100;
        this.y = -100;
      },
      update() {
        this._update();
        if (
          this.y > 240 ||
          this.y < 0 ||
          this.x > 256 ||
          this.x < 0
        ) {
          this.ttl = 0;
        }
      },
      draw() {
        const { context: ctx } = this;
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, this.width, this.width);
      },
    });
  }

  function gameScene() {
    onKey(['esc'], () => {
      emit('change-scene', 'menu');
    });

    function processChildren(children, parent) {
      if (children.length === 0) return;
      parent.childrenKilled = 0;
      parent.bossRadius = 30;
      parent.bossSpeed = 100;
      parent.isBoss = true;
      parent.width = 16;
      parent.height = 16;
      // parent.shield = 20;
      // parent.maxShield = 20;
      children.forEach(child => {
        for (let i = 0; i < child[3]; i++) {
          const angle = i * (360 / child[3]);
          enemyPool.get({
            sprite: child[0],
            rotate: child[1],
            ttl: Infinity,
            imune: true,
            dying: false,
            shield: child[2] + Math.floor(virtualLevel / 4),
            frame: 0,
            isBoss: false,
            parent,
            loop: parent.loop,
            path: parent.path,
            anglePlacement: degToRad(angle),
            fireMode: child[4],
            wave: parent.wave,
          });
        }    });
    }
    function processDialogs(dialogs, frame) {
      dialogs.forEach(obj => {
        if (frame !== undefined && frame === obj.frame) {
          dialog.start(obj);
        }
      });
    }
    function processPowerups(powerups, frame) {
      const types = [
        ['powerup-fire', 'green', 5],
        ['powerup-shield', 'yellow', 18],
      ];
      powerups.forEach(powerup => {
        if (powerup.frame !== undefined && frame === powerup.frame) {
          const type = types[powerup.type];
          powerupPool.get({
            name: type[0],
            x: powerup.x,
            y: -8,
            width: 8,
            height: 8,
            color: type[1],
            dy: powerup.speed,
            image: imageAssets['font.png'],
            value: powerup.value,
            ttl: Infinity,
            die() {
              ship.score += this.value;
              powerup.type === 0 && zzfx(...[1.6,,291,.01,.21,.35,,2.2,,,-136,.09,.03,,,.2,.2,.7,.28]); // Powerup 47
              powerup.type === 1 && zzfx(...[.5,,375,.03,.07,.08,1,2.7,,,302,.05,.05,,,,,.93,.01,,607]); // Pickup 61
              this.ttl = 0;
            },
            update() {
              this._update();
              if (this.y > 240) {
                this.ttl = 0;
              }
            },
            draw() {
              const { context: ctx } = this;
              if(this.frame % 20 < 10) {
                ctx.fillStyle = this.color;
                ctx.fillRect(-3, -3, this.width + 6, this.height + 6);  
                ctx.fillStyle = 'black';
                ctx.fillRect(-2, -2, this.width + 4, this.height + 4);  
              }
              ctx.fillStyle = this.color;
              ctx.fillRect(-1, -1, this.width + 2, this.height + 2);
              ctx.drawImage(this.image, 8 * type[2], 0, 8, 8, 0, 0, 8, 8);
            },
          });
        }
      });
    }
    function processLevel(level, frame, doDialogs = true) {
      level.waves.forEach(wave => {
        const waveFrame = frame - wave.frame;
        const totalFrames = wave.frame + (wave.total * wave.interval);
        if (frame >= wave.frame && frame < totalFrames && wave.count < wave.total && waveFrame % wave.interval === 0) {
          wave.completed = false;
          wave.count += 1;
          const shieldMultiplier = virtualLevel / currentLevel > 1 ? Math.floor((virtualLevel / currentLevel) * wave.shield * 0.2) : 0;
          const enemy = enemyPool.get({
            x: -100,
            y: -100,
            path: wave.path,
            rotate: wave.rotate,
            loop: wave.loop,
            ttl: Infinity,
            imune: true,
            dying: false,
            shield: wave.shield + shieldMultiplier,
            maxShield: wave.shield + shieldMultiplier,
            frame: 0,
            sprite: wave.sprite,
            parent: null,
            isBoss: false,
            fireMode: wave.fireMode,
            fireTimer: 0,
            wave,
          });
          processChildren(wave.children || [], enemy);
        }
        processPowerups(wave.powerups, frame);
        doDialogs && processDialogs(wave.dialogs, frame);

        if (!wave.completed && wave.count === wave.total && wave.killed === wave.total) {
          wave.completed = true;
        }
      });
    }

    function checkCollisions(source, targets) {
      if (!source.isAlive() || source.imune) return;
      targets.forEach(target => {
        if (source.name === 'enemy' && target.name === 'enemy') return;

        if (target.isAlive() && !source.imune && !target.imune && collides(target, source)) {

          !target.name.includes('powerup-') && !target.isBoss && target.die();

          if (source.name == 'ship' && target.name == 'enemy') {
            source.hit(50);
          } else if (source.name == 'ship' && target.name == 'powerup-fire') {
            source.firePowerup(target.value);
            target.die();
          } else if (source.name == 'ship' && target.name == 'powerup-shield') {
            source.shieldPowerup(target.value);
            target.die();
          } else if (source.name == 'ship') {
            source.hit(10);
          }

          source.name == 'enemy' && (source.hit(1), ship.score += 10);
        }
      });
    }

    let
      virtualLevel = 1,
      currentLevel = 1;

    const ship = createShip();
    const starField = starfield();
    const dialog = createDialog({ x: 8, y: 224 });

    const bulletPool = pool({
      create: gameObject,
      maxSize: 100,
    });

    const enemyBulletPool = pool({
      create: createEnemyBullet, // gameObject,
      maxSize: 100,
    });

    const enemyPool = pool({
      create: createEnemy,
      maxSize: 100,
    });

    const explosionPool = pool({
      create: gameObject,
      maxSize: 300,
    });

    const powerupPool = pool({
      create: gameObject,
      maxSize: 10,
    });

    const textScore = text({
      x: 8,
      y: 8,
      text: 'SCORE 0',
    });

    const textLives = text({
      x: 256 - 8 - 8 * 3,
      y: 8,
      text: '@@@',
      color: 'red',
    });

    const textFrames = text({
      x: 8,
      y: 240 - 16,
      text: '',
      color: 'yellow',
    });

    const levelText = text({
      x: 128,
      y: 120,
      text: `LEVEL ${virtualLevel}`,
      color: 'lightgreen',
      align: 'center',
    });

    const progressShield = gameObject({
      x: 256 - 8 * 8,
      y: 8,
      width: 24,
      height: 8,
      anchor: { x: 0, y: 0 },
      draw() {
        const { context: ctx } = this;
        const value = ship.shield >= 0 ? ship.shield / 5: 0; // ship.shield >= 0 ? 24 * ship.shield / 100 : 0;
        ctx.strokeStyle = 'white';
        ctx.strokeRect(0, 0, this.width, this.height);

        ctx.fillStyle = 'green';
        ship.shield < 25 && (ctx.fillStyle = 'red');
        ctx.fillRect(2, 2, value, this.height-4);
      }
    });

    // Events
    on('ship-fire', (x, spread = 0) => {
      bulletPool.get({
        name: 'ship-bullet',
        x,
        y: ship.y - 4,
        dx: (1 - Math.random() * 2) / (4 - spread),
        dy: -5,
        width: 2,
        height: 3,
        ttl: 80,
        die() {
          this.ttl = 0;
          this.x = -100;
          this.y = -100;
        },
        draw() {
          const { context: ctx } = this;
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, this.width, 1);
          ctx.fillStyle = 'yellow';
          ctx.fillRect(0, 1, this.width, 1);
          ctx.fillStyle = 'red';
          ctx.fillRect(0, 2, this.width, 1);
        },
      });
      zzfx(...[.9,,413,,.05,.01,1,3.8,-3,-13.4,,,,,,,.11,.65,.07,,237]); // Shoot 124
    });

    on('enemy-fire', ({ x, y }, mode = 0) => {
      const vx = ship.x - 4 - x;
      const vy = ship.y - y;
      const dist = Math.hypot(vx, vy) / 1;
      if (mode === 2) {
        for (let i = 0; i < 12; i++) {
          const dx = Math.cos(degToRad(30 * i)) * 1;
          const dy = Math.sin(degToRad(30 * i)) * 1;
          enemyBulletPool.get({
            name: 'enemy-bullet',
            x: x,
            y: y,
            dx,
            dy,
            frame: 0,
            ttl: 400,
          });
        }
      } else {
        enemyBulletPool.get({
          name: 'enemy-bullet',
          x: x + 4,
          y: y + 4,
          dx: mode == 0 ? 0 : vx / dist,
          dy: mode == 0 ? 1.5 : vy / dist,
          frame: 0,
          ttl: 400,
        });
      }
      zzfx(...[.3,,222,.02,.04,.09,3,.3,11,10,,,,,15,,,.53,.17]); // Shoot 141
    });

    on('explosion', (x, y, volume = 50, magnitude = 3, color = 'white') => {
      for (let i = 0; i < volume; i++) {
        let angle = Math.random() * 360;
        let maxMagnitude = magnitude;
        let newMagnitude = Math.random() * maxMagnitude + maxMagnitude;
      
        explosionPool.get({
          name: 'particle',
          x,
          y,
          dx: Math.cos(degToRad(angle)) * newMagnitude / 10,
          dy: Math.sin(degToRad(angle)) * newMagnitude / 10,
          width: 1,
          height: 1,
          ttl: 30 * maxMagnitude,
          color,
          update() {
            const col = 256 / 30 * maxMagnitude * (this.ttl / 30);
            color == 'white' && (this.color = `rgb(${col},${col},${col})`);
            color == 'red' && (this.color = `rgb(${col},0,0)`);
            this._update();
          },
          draw() {
            const { context: ctx } = this;
            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, this.width, this.height);
          }
        });

        explosionPool.get({
          name: 'particle',
          x,
          y,
          dx: Math.cos(degToRad(angle)) * newMagnitude / 20,
          dy: Math.sin(degToRad(angle)) * newMagnitude / 20,
          width: 2,
          height: 2,
          ttl: 10 * maxMagnitude / 2,
          update() {
            const col = 256 / (maxMagnitude / 2) * (this.ttl / 10);
            this.color = `rgb(${col},${col},${col})`;
            this._update();
          },
          draw() {
            const { context: ctx } = this;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        });

      }
      zzfx(...[,,45,.03,.21,.6,4,.9,2,-3,,,,.2,,.9,,.45,.26]); // Explosion 39
    });

    on('game-over', () => {
      setTimeout(() => emit('change-scene', 'game-over', {score: ship.score}), 2000);
    });

    const qtShip = new Quadtree();
    const qtEnemies = new Quadtree();

    return scene({
      objects: [starField, ship, powerupPool, bulletPool, enemyBulletPool, enemyPool, explosionPool, textScore, textLives, progressShield, dialog],
      level: getLevel(currentLevel, 1) ,//levels[0],
      frame: 0,
      update() {
        if (dialog.isTalking) {
          // starField.update();
          dialog.update();
          return;
        }
        processLevel(this.level, this.frame, virtualLevel == currentLevel);
        levelText.update();

        qtShip.clear();
        qtShip.add(ship, enemyPool.getAliveObjects(), enemyBulletPool.getAliveObjects(),powerupPool.getAliveObjects());
        checkCollisions(ship, qtShip.get(ship));

        qtEnemies.clear();
        enemyPool.getAliveObjects().forEach(enemy => {
          qtEnemies.add(enemy, bulletPool.getAliveObjects());
          checkCollisions(enemy, qtEnemies.get(enemy));
        });

        const wavesLeft = this.level.waves.filter(wave => !wave.completed).length;
        if (wavesLeft === 0 && enemyPool.getAliveObjects().length === 0) {
          virtualLevel++;
          currentLevel++;
          currentLevel > totalLevels && (currentLevel = 1);
          this.level = getLevel(currentLevel, virtualLevel);
          this.frame = 0;
          levelText.text = `LEVEL ${virtualLevel}`;
          zzfx(...[,,264,.07,.29,.06,1,3.7,,-30,-148,.07,.08,,,,,.76,.22,,-1240]); // Powerup 152
        }

        textScore.text = `SCORE ${ship.score}`;
        textLives.text = `@@@`.slice(0, ship.lives);
        textFrames.text = `${(this.frame + '').padStart(8, '0')} ${(wavesLeft + '').padStart(2, '0')}`;

        this.frame++;
        this.objects.forEach(object => object.update());
      },
      render() {
        this.frame < 100 && levelText.render();
      },
    });
  }

  function menuScene() {
    onKey(['enter'], () => {
      emit('change-scene', 'game');
    });

    const hiscore = localStorage.getItem('hiscore') || 0;
    const starField = starfield();

    const titleText = text({
      text: 'MICRO SHOOTER',
      x: 128,
      y: 48,
      align: 'center',
      scale: 2,
      color: 'red',
    });
    const subtitleText = text({
      text: 'JS13K 2024 EDITION',
      x: 128,
      y: 96,
      align: 'center',
    });
    const hiscoreText = text({
      text: `HIGH SCORE ${hiscore}`,
      x: 128,
      y: 120,
      align: 'center',
      color: 'yellow',
    });
    const pressText = text({
      text: 'PRESS ENTER TO START',
      x: 128,
      y: 144,
      align: 'center',
      color: 'lightgreen',
    });
    const controlsText = text({
      text: 'ARROWS TO MOVE\nSPACE TO SHOOT',
      x: 128,
      y: 192,
      align: 'center',
    });
    return scene({
      objects: [starField, titleText, subtitleText, hiscoreText, pressText, controlsText],
    });
  }

  function gameOverScene(options) {
    const { score } = options;
    const hiscore = localStorage.getItem('hiscore') || 0;
    onKey(['enter'], () => {
      emit('change-scene', 'menu');
    });

    const starField = starfield();

    const titleText = text({
      text: 'GAME OVER',
      x: 128,
      y: 48,
      align: 'center',
      scale: 2,
      color: 'red',
    });
    const subtitleText = text({
      text: `SCORE ${score}`,
      x: 128,
      y: 96,
      align: 'center',
    });
    const pressText = text({
      text: 'PRESS ENTER TO CONTINUE',
      x: 128,
      y: 144,
      align: 'center',
      color: 'lightgreen',
    });

    const dialog = createDialog({ x: 8, y: 224 });

    const gameOverScene = scene({
      objects: [starField, titleText, subtitleText, pressText, dialog],
    });

    const texts = [
      'GOOD BYE CAPTAIN @        ',
      'THE ENEMY HAS WON',
      'BUT... HEY!     ',
      'THIS IS JUST A GAME',
    ];
    if (score > hiscore) {
      texts.push(`YOU HAVE A NEW HIGH SCORE!`);
    } else {
      texts.push('TRY TO BEAT YOUR HIGH SCORE!');
    }
    dialog.start({
      texts
    });

    if (score > hiscore) {
      localStorage.setItem('hiscore', score);
      const hiscoreText = text({
        text: `NEW HIGH SCORE ${score}`,
        x: 128,
        y: 120,
        align: 'center',
        color: 'yellow',
      });
      gameOverScene.objects.push(hiscoreText);
    }

    return gameOverScene;
  }

  const ctx = setContext(document.getElementById('c').getContext('2d'));
  ctx.imageSmoothingEnabled = false;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.filter = 'url(#remove-alpha)';

  initKeys();

  function toggleExperience() {
    const ctx = getContext();
    if (ctx.filter === 'url(#remove-alpha)') {
      ctx.filter = 'none';
    } else {
      ctx.filter = 'url(#remove-alpha)';
    }
  }

  (async () => {
    await loadImage('font.png');
    await loadImage('spritesheet.png');
    await loadImage('spritesheet16.png');

    onKey('e', toggleExperience);

    on('change-scene', (scene, options) => {
      offKey(['enter', 'esc']);
      clearEvents(['change-scene']);
      scene === 'game' && (currentScene = gameScene());
      scene === 'menu' && (currentScene = menuScene());
      scene === 'game-over' && (currentScene = gameOverScene(options));
    });

    let currentScene = menuScene();
    
    const game = gameLoop({
      update() {
        currentScene.update();
      },
      render() {
        currentScene.render();
      },
    });

    game.start();
  })();

})();
