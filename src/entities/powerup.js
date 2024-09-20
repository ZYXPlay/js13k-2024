import { imageAssets } from "../engine/assets";
import { GameObject } from "../engine/game-object";

export class Powerup extends GameObject {
  init(props) {
    super.init({
      name: 'powerup',
      type: 'fire',
      width: 16,
      height: 16,
      taken: false,
      // ttl: 600,
      anchor: { x: .5, y: .5 },
      spritesheet: [imageAssets['font-white.png'], 8, 8],
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
    super.update();
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

export function powerup(props) {
  return new Powerup(props);
}
