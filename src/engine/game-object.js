import { imageAssets } from "./assets";
import { emit } from "./events";
import { delay, getContext } from "./utils";

export class GameObject {
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
    };

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

export const gameObject = (props) => new GameObject(props);