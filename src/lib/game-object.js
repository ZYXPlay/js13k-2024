import { getContext } from "./utils";

export default function gameObject ({
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
  }

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
