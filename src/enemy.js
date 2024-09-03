import gameObject from "./lib/game-object";
import { angleToTarget, clamp, degToRad } from "./lib/utils";
import { imageAssets } from "./lib/assets";
import { emit } from "./lib/events";
import { zzfx } from "./lib/zzfx";

export default function createEnemy (props) {
  const explosionColors = [null, null, null, 'purple', 'red', 'cyan', 'green', 'yellow', 'pink', 'orange'];
  return gameObject({
    name: 'enemy',
    x: -80,
    y: -80,
    image: imageAssets['spritesheet.png'],
    sprite: 4,
    fireTimer: 0,
    hitTimer: 0,
    frame: 0,
    scaleX: 0.1,
    scaleY: 0.1,
    shield: 2,
    imune: true,
    dying: false,
    ...props,
    hit(damage) {
      this.shield -= damage;
      this.hitTimer = 1;
      this.shield <= 0 && !this.dying && this.die();
      zzfx(...[2.3,,330,,.06,.17,2,3.7,,,,,.05,.4,2,.5,.13,.89,.05,.17]); // Hit 56
    },
    die() {
      this.wave.killed++;
      this.imune = true;
      this.dying = true;
      this.ttl = 10;
    },
    update() {
      const xy = this.path.getPointAtLength(this.frame);
      const nextXy = this.path.getPointAtLength(this.frame + 1);

      this.x = Math.floor(xy.x);
      this.y = Math.floor(xy.y);

      this.hitTimer > 4 && (this.hitTimer = 0);

      this.rotate && (this.rotation = degToRad(90) + (angleToTarget(xy, nextXy)));
      !this.rotate && (this.rotation = degToRad(180));

      if (this.frame >= this.path.getTotalLength()) {
        this.frame = 0;
        !this.loop && (this.wave.killed++, this.ttl = 0);
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

      Math.random() > 0.995 && emit('enemy-fire', this, this.rotate ? 1 : 0);

      this.hitTimer > 0 && this.hitTimer++;
      this.fireTimer++;

      this._update();

      this.ttl <= 0 && this.dying && (emit('explosion', this.x, this.y, 20, 5, explosionColors[this.sprite]));
    },
    draw() {
      const { context: ctx } = this;
      // @todo drawing only after frame 1 to avoid scale flickering
      this.frame > 1 && ctx.drawImage(this.image, 8 * this.sprite, 0, 8, 8, 0, 0, 8, 8);

      if (this.hitTimer) {
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 8, 8);
        ctx.globalCompositeOperation = "source-over";
      }
    }
  });
};