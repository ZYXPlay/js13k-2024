import { imageAssets } from "./lib/assets";
import { emit } from "./lib/events";
import gameObject from "./lib/game-object";

export default function createAsteroid () {
  return gameObject({
    name: 'asteroid',
    x: 0,
    y: -16,
    image: imageAssets['spritesheet.png'],
    image16: imageAssets['spritesheet16.png'],
    sprite: 2,
    frame: 0,
    scaleX: 1,
    scaleY: 1,
    width: 16,
    height: 16,
    angle: 0,
    speed: 1,
    rotation: 0,
    rotate: false,
    ttl: 0,
    frame: 0,
    hitted: false,
    shield: 20,
    hit() {
      this.hitted = true;
      this.shield--;
      setTimeout(() => {
        this.hitted = false;
      }, 200);
    },
    die() {
      emit('explosion', this.x, this.y, 20, 10, 'white');
      this.ttl = 0;
      this.wave && this.wave.killed++;
    },
    update() {
      this.rotation += 0.1;
      this.shield <= 0 && this.die();
      this._update();
      (this.y > 260 || this.x < -16 || this.x > 266) && (this.ttl = 0, this.wave && this.wave.killed++);
    },
    draw() {
      const { context: ctx } = this;
      ctx.drawImage(this.image16, 16 * 2, 0, 16, 16, 0, 0, 16, 16);
      if (this.hitted) {
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 16, 16);
        ctx.globalCompositeOperation = "source-over";
      }
    }
  });
}
