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

  function delay(callback, ms, ...args) {
    return setTimeout(callback, ms, ...args);
  }

  function rnd(min = 0, max = 1) {
    return (Math.random())*(max-min)+min;
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
      this._uf && this._uf();
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

          const sx = index * charWidth,
            sy = 0,
            sw = charWidth,
            sh = charHeight,
            dx = i * charWidth,
            dy = 0,
            dw = charWidth,
            dh = charHeight;

          context.drawImage(this.spritesheet, sx, sy, sw, sh, dx, dy, dw, dh);
          context.globalCompositeOperation = "source-atop";
          context.fillStyle = color || "white";
          context.fillRect(dx, 0, charWidth, charHeight);
          context.globalCompositeOperation = "source-over";
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
        16 * 8, 0, 8, 8,
        0, 0, 8, 8
      );

      this.color && (
        this.context.fillStyle = this.color,
        this.context.fillRect(0, 0, 1, 1)
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

  class Ship extends GameObject {
    init(props) {
      const properties = {
        name: 'ship',
        spawning: true,
        y: 248,
        imune: false,
        dying: false,
        shield: 100,
        lives: 3,
        score: 0,
        fireLevel: 0,
        firing: false,
        anchor: { x: .5, y: .5 },
        sprite: 1,
        ...props,
      };
      super.init(properties);
      this.spawn();
    }
    powerUp(powerup) {
      if (powerup.type === 'shield') {
        this.shield += 50;
        this.shield > 100 && (this.shield = 100);
      }

      if (powerup.type === 'fire') {
        this.fireLevel++;
        this.fireLevel > 3 && (this.fireLevel = 3);
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

      if (this.fireLevel  > 2) {
        delay(() => {
          emit('ship-fire', this.x - 1, this.y - 8, -2);
          emit('ship-fire', this.x - 1, this.y - 8, 2);
        }, 400);
      }

      delay(() => {
        this.firing = false;
      }, 200);
    }
    die() {
      emit('explosion', this.x, this.y - 4, 60, 4, 'white');
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
      this.y = 248;
      this.frame = 0;
      this.shield = 100;
      this.fireLevel = 0;
      delay(() => {
        this.spawning = false;
        this.imune = false;
      }, 1000);
    }
    update() {
      const friction = .96;

      this.ddx = 0;
      this.ddy = 0;

      this.dx *= friction;
      this.dy *= friction;

      this.sprite = 1;

      keyPressed(['d', 'arrowright']) && this.dx < 5 && (this.ddx = .2, this.sprite = 2);
      keyPressed(['a', 'arrowleft']) && this.dx > -5 && (this.ddx = -.2, this.sprite = 0);

      if (!this.spawning) {
        keyPressed(['s', 'arrowdown']) && this.dy < 5 && (this.ddy = .2);
        keyPressed(['w', 'arrowup']) && this.dy > -5 && (this.ddy = -.2);
      }

      !this.firing && keyPressed('space') && this.fire();

      if (this.spawning) {
        this.ddy = -.03;
        this.scaleX = this.scaleY = clamp(1, 2, 2 - this.frame / 60);
      }

      this.shield <= 0 && this.die();

      this.advance();

      this.x < 4 && (this.x = 4, this.dx = 0);
      this.x > 252 && (this.x = 252, this.dx = 0);
      this.y < 4 && (this.y = 4, this.dy = 0);
      this.y > 236 && (this.y = 236, this.dy = 0);
    }
    draw() {
      const { context: ctx, x, y, width, height } = this;
      ctx.drawImage(this.spritesheet[0], this.spritesheet[1] * this.sprite, 0, width, height, 0, 0, width, height);

      let boost = 1;
      this.ddy < 0 && (boost = this.frame % 10 < 5 ? 2 : 3);
      ctx.fillStyle = '#FFaa33';
      ctx.fillRect(3, 7, 2, boost);
      ctx.fillStyle = '#FF6633';
      ctx.fillRect(this.frame % 10 < 5 ? 3 : 4, 7 + boost, 1, boost);

      if (this.hitted) {
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = 'white';
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
      maxSize: 241,
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

    for (let i = 0; i < 240; i++) {
      const velocity = rnd(1, 3) * vel;
      const color = Math.floor((velocity / vel) * 50) + 50;
      starPool.get(
        {
          x: Math.floor(rnd(0, 256)),
          y: i,
          width: 1,
          height: 1,
          dy: velocity / 4,
          color: `rgb(${color}, ${color}, ${color})`,
          update() {
            this.advance();
            if (this.y > 240) {
              this.y = 0;
            }
          },
        }
      );
    }

    starPool.isAlive = () => true;
    return starPool;
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

  class Asteroid extends GameObject {
    init(props) {
      const properties = {
        name: 'asteroid',
        spritesheet: [imageAssets['spritesheet16.png'], 16, 16],
        sprite: 2,
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
      this.x < 0 || this.x > 264 || this.y > 248 && (this.ttl = 0);
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
        ...props,
      };

      super.init(properties);
      this.path && (this.ttl = Math.floor(properties.path.getTotalLength()));
      this.loop && (this.ttl = Infinity);
    }
    fire() {
      emit('enemy-fire', this.x - 4, this.y - 4, this.rotation, 3);
    }
    die() {
      emit('explosion', this.x, this.y, 30, 3, this.debryColor);
      emit('score', 10);
      this.ttl = 0;
    }
    update () {
      this.rotation = degToRad(180);

      if (this.path) {
        const xy = this.path.getPointAtLength(this.frame);
        const nextXy = this.path.getPointAtLength(this.frame + 1);
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

      this.firstRun && (this.scaleX = this.scaleY = clamp(0, 1, (this.frame + 1) / 100));
      !this.loop && this.ttl < 100 && (this.scaleX = this.scaleY = clamp(0, 1, this.ttl / 100));

      // Imunity via scale? why not?
      this.scaleX < 1 && (this.imune = true);
      this.scaleX >= 1 && (this.imune = false);

      // Only fire when the enemy is fully visible, using scale...
      this.scaleX == 1 && this.frame % this.fireRate === 0 && this.fire();

      this.path && this.frame >= this.path.getTotalLength() && this.loop && (this.frame = 0, this.firstRun = false);

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
      emit('explosion', this.x, this.y, 30, 3, this.debryColor);
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
      this.frame % 5 == 0 && (this.textIndex++, t[this.textIndex] !== ' ' && zzfx(...[1.5,,261,.01,.02,.08,1,1.5,-0.5,,,-0.5,,,,,.9,.05]));
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
        width: 16,
        height: 16,
        taken: false,
        ttl: 600,
        anchor: { x: .5, y: .5 },
        spritesheet: [imageAssets['font.png'], 8, 8],
        ...props,
      });
    }
    die() {
      this.taken = true;
      this.ttl = 10;
      this.frame = 0;
      zzfx(...[1.5, , 1000, , .1, .1, 1, 1.5, , , , , , , , .1, .5, .1]); // Pickup 74
    }
    draw() {
      const { context: ctx, type, taken, frame } = this;

      let color, sprite;
      type === 'shield' && (color = 'yellow', sprite = 18);
      type === 'fire' && (color = 'lightblue', sprite = 15);

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      if (frame % 20 < 10 && !taken) {
        ctx.strokeRect(0, 0, 16, 16);
      }

      ctx.fillStyle = color;
      ctx.fillRect(3, 3, 10, 10);
      ctx.drawImage(this.spritesheet[0], 8 * sprite, 0, 8, 8, 4, 4, 8, 8);

      if (taken) {
        ctx.globalAlpha = 1 - this.frame / 10;
        ctx.strokeRect(-this.frame, -this.frame, 16 + (this.frame * 2), 16 + (this.frame * 2));
        ctx.globalAlpha = 1;
      }
    }
  }

  function powerup(props) {
    return new Powerup(props);
  }

  var l01 = [
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
      500: [
        1, // total
        1000, // interval
        6, // sprite
        false, // rotate
        false, // loop
        1, // shield
        0, // fire mode
        130, // fire rate
        'M287 13-21 61l293 46-293 31 293 48-290 52', // path
      ],
    },
    { // asteroids
      // 1000: [
      //   20, // total
      //   1000, // interval ms
      //   [20, 200, 120, 180, 60, 220, 180, 40, 120, 60], // x positions
      //   [.1, -.1, 0, -.1, .1, -.1, 0, .1, 0, .1], // dx speeds
      //   [1, .5, .7, .5, .9, .5, 1, .8, .4, .7], // dy speeds
      // ],
    }, 
    { // powerups
      500: [
        'fire', // type
        128, // x
        .6, // velocity
      ],
    },
    { // dialogs
      500: [
        false, // pause gameplay
        [
          'A FULL WAVE IS IMINENT',
          '    ',
        ], // texts
      ],
    },
    [ // boss
      0, // sprite
      10, // shield
      250, // fire rate
      'M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z', // path
      30, // boss radius
      8, // total children
      3, // children sprite
      0, // fire mode children
      30, // children speed
      250, // children fire rate
    ],
  ];

  var l02 = [
    { // enemies
      2000: [ // frame
        3, // total
        1000, // interval (ms) frame = 1000 / 1000 * 60 = 60
        3, // sprite
        true, // rotate
        false, // loop
        1, // shield
        0, // fire mode
        200, // fire rate
        'M223-33v238c0 42-61 41-61 0V41c0-44-64-44-64 0v164c0 43-71 33-71 0V-27', // path
      ],
      1000: [
        5, // total
        1500, // interval
        6, // sprite
        false, // rotate
        false, // loop
        1, // shield
        0, // fire mode
        130, // fire rate
        'M287 13-21 61l293 46-293 31 293 48-290 52', // path
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
      500: [
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
      200, // fire rate
      'M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z', // path
      40, // boss radius
      32, // total children
      9, // children sprite
      1, // fire mode children
      60, // children speed
      250, // children fire rate
    ],
  ];

  const levels = [
    l01,
    l02,
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


    const shipInstance = ship({ x: 120, y: 248 });
    const starPool = starfield(20);
    const dialogInstance = dialog();
    onKey(['enter'], () => dialogInstance.skip());
    getContext();
    let currentLevel = 0, virtualLevel = 0;
    let frame = 0;
    let firstRun = true;
    let canSpawnBoss = false;
    let levelLastFrame = getLevelLastFrame(currentLevel);

    const explosionPool = pool({
      create: explosionParticle,
      maxSize: 400,
    });

    const shipBulletPool = pool({
      create: gameObject,
      maxSize: 40,
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
      create: powerup,
      maxSize: 4,
    });

    const textScore = text({
      text: 'SCORE 00000',
      x: 8,
      y: 8,
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

    on('hit', () => {
      zzfx(...[2.3, , 330, , .06, .17, 2, 3.7, , , , , .05, .4, 2, .5, .13, .89, .05, .17]); // Hit 56
    });

    on('explosion', (x, y, volume, magnitude, color) => {
      zzfx(...[, , 45, .03, .21, .6, 4, .9, 2, -3, , , , .2, , .9, , .45, .26]); // Explosion 39

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
      zzfx(...[.9, , 413, , .05, .01, 1, 3.8, -3, -13.4, , , , , , , .11, .65, .07, , 237]); // Shoot 124
      shipBulletPool.get({
        name: 'ship-bullet',
        x,
        y,
        width: 2,
        height: 4,
        dy: -4,
        dx,
        color: null,
        sprite: 17,
        ttl: 100,
        update() {
          this.advance();
          if (this.y < 0) this.ttl = 0;
        }
      });
    });

    on('enemy-fire', (x, y) => {
      zzfx(...[.9, , 413, , .05, .01, 1, 3.8, -3, -13.4, , , , , , , .11, .65, .07, , 237]); // Shoot 124
      const vx = (shipInstance.x - 4) - x;
      const vy = (shipInstance.y - 4) - y;
      const dist = Math.hypot(vx, vy) / 1;

      enemyBulletPool.get({
        name: 'enemy-bullet',
        x: x + 4,
        y: y + 4,
        dx: vx / dist,
        dy: vy / dist,
        width: 2,
        height: 2,
        color: 'red',
        ttl: 200,
      });
    });

    on('boss-fire', (x, y) => {
      zzfx(...[.9, , 413, , .05, .01, 1, 3.8, -3, -13.4, , , , , , , .11, .65, .07, , 237]); // Shoot 124

      for (let i = 0; i < 12; i++) {
        const dx = Math.cos(degToRad(30 * i)) * 1;
        const dy = Math.sin(degToRad(30 * i)) * 1;
        enemyBulletPool.get({
          name: 'enemy-bullet',
          x: x,
          y: y,
          dx,
          dy,
          width: 2,
          height: 2,
          color: 'red',
          ttl: 400,
        });
      }
    });

    on('score', value => {
      shipInstance.score += value;
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
      const shieldMultiplier = (virtualLevel + 1) / (currentLevel + 1) > 1 ? Math.floor(((virtualLevel + 1) / (currentLevel + 1)) * props.shield * 0.2) : 0;

      for (let i = 0; i < total; i++) {
        const angle = i * (360 / total);
        delay((angle) => {
          enemyPool.get({
            ...props,
            anglePlacement: degToRad(angle),
            shield: props.shield + shieldMultiplier,
          });
        }, i * interval, angle);
      }
    });

    on('spawn-asteroid', (total, interval, positions, speedsX, speedsY) => {
      const shieldMultiplier = (virtualLevel + 1) / (currentLevel + 1) > 1 ? Math.floor(((virtualLevel + 1) / (currentLevel + 1)) * 10 * 0.2) : 0;
      let vi = 0;
      for (let i = 0; i < total; i++) {
        vi > positions.length - 1 && (vi = 0);

        delay((i, vi) => {
          asteroidPool.get({
            x: positions[vi],
            y: -8,
            dx: speedsX[vi],
            dy: speedsY[vi],
            shield: 10 + shieldMultiplier,
          });
        }, i * interval, i, vi);

        vi++;
      }
    });

    on('spawn-powerup', (type, x, dy) => {
      powerupPool.get({ type, x, y: -8, dy });
    });

    on('set-dialog', (pauseOnTalk, texts) => {
      dialogInstance.start({
        texts,
        pauseOnTalk,
      });
    });

    on('next-level', level => {
      currentLevel = level;
      virtualLevel++;
      frame = 0;
      firstRun = false;
      levelLastFrame = getLevelLastFrame(level);
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

    const qtShipBullets = quadtree();
    const qtShip = quadtree();
    const qtAsteroids = quadtree();

    return scene({
      children: [
        starPool,
        textScore,
        textLives,
        shipBulletPool,
        enemyBulletPool,
        shipInstance,
        enemyPool,
        bossPool,
        asteroidPool,
        powerupPool,
        explosionPool,
        progressShield,
        dialogInstance,
        levelText,
      ],
      update() {
        this.paused = false;
        if (dialogInstance.isTalking && dialogInstance.pauseOnTalk) {
          dialogInstance.update();
          this.paused = true;
          return;
        }

        if (frame < 40) {
          levelText.text = `LEVEL ${virtualLevel + 1}`;
          levelText.ttl = 100;
        }

        const totalEnemies = enemyPool.size + asteroidPool.size;
        frame === levelLastFrame && (canSpawnBoss = true);
        processLevel(frame, currentLevel, totalEnemies, canSpawnBoss);

        if (shipInstance.lives <= 0) {
          emit('game-over');
          return;
        }

        shipBulletPool.getAliveObjects().forEach(bullet => {
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
        frame++;
      },
    });
  }

  function menuScene() {
    onKey(['enter'], () => {
      emit('change-scene', 'game');
    });
    const starPool = starfield(20);

    const titleText = text({
      x: 128,
      y: 32,
      text: 'MICRO SHOOTER',
      align: 'center',
      color: 'red',
      scaleX: 2,
      scaleY: 4,
    });

    const editionText = text({
      x: 128,
      y: 88,
      text: 'JS13K 2024 EDITION',
      align: 'center',
      color: 'yellow',
    });

    const gameByText = text({
      x: 128,
      y: 128,
      text: 'A GAME BY\nMARCO FERNANDES',
      lineHeight: 16,
      color: 'white',
      align: 'center',
    });

    const controlsText = text({
      x: 128,
      y: 128 + 48,
      text: 'ARROWS OR WASD TO MOVE\nSPACE TO SHOOT',
      lineHeight: 16,
      align: 'center',
    });

    const startText = text({
      x: 128,
      y: 240 - 16,
      text: 'ENTER TO START',
      color: 'lightgreen',
      align: 'center',
    });

    const s = scene({
      frame: 0,
      children: [
        starPool,
        startText,
      ],
      update() {
        this.frame > 40 && this.frame < 140 && this.frame % 20 === 0 && starPool.decreaseVel(2);
        this.frame++;
      }
    });

    delay(() => {
      s.add(titleText);
    }, 1000);

    delay(() => {
      s.add(editionText);
    }, 2000);

    delay(() => {
      s.add(gameByText);
    }, 3000);

    delay(() => {
      s.add(controlsText);
    }, 4000);

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
      zzfx(...[, , 45, .03, .21, .6, 4, .9, 2, -3, , , , .2, , .9, , .45, .26]); // Explosion 39

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

    const titleText = text({
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
      y: 80,
      text: 'YOUR SCORE:',
      color: 'white',
      align: 'center',
    });

    const scoreText = text({
      x: 128,
      y: 96,
      text: `${score}`,
      color: 'white',
      align: 'center',
      scaleX: 2,
      scaleY: 2,
    });

    const hiscoreText = text({
      x: 128,
      y: 128,
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
      s.add(titleText);
      emit('explosion', 128, 48, 100, 6, 'red');
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
        emit('explosion', 128, 132, 60, 4, 'yellow');
      }, 3000);
    }

    return s;
  }

  const ctx = setContext(document.getElementById('c').getContext('2d'));
  ctx.imageSmoothingEnabled = false;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.filter = 'url(#remove-alpha)';

  (async () => {
    initKeys();

    await loadImage('font.png');
    await loadImage('spritesheet.png');
    await loadImage('spritesheet16.png');

    function changeScene(scene, props) {
      clearEvents(['change-scene']);
      ctx.filter = 'url(#remove-alpha)';
      switch (scene) {
        case 'game':
          currentScene = gameScene();
          break;
        case 'menu':
          currentScene = menuScene();
          break;
        case 'game-over':
          console.log('game-over', props);
          currentScene = gameOverScene(props);
          break;
      }
    }

    on('change-scene', (scene, props) => changeScene(scene, props));

    let currentScene = menuScene();

    const loop = gameLoop({
      update(dt) {
        currentScene.update(dt);
      },
      render() {
        currentScene.render();
      }
    });

    loop.start();

  })();

})();
