import { imageAssets } from "../engine/assets";
import { GameObject } from "../engine/game-object";

export class Powerup extends GameObject {
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

export function powerup(props) {
  return new Powerup(props);
}
