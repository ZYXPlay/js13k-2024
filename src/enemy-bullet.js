import gameObject from "./lib/game-object";

export default function createEnemyBullet (props = {}) {
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
