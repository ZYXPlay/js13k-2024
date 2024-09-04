import gameObject from "./lib/game-object";
import { angleToTarget, clamp, degToRad } from "./lib/utils";
import { imageAssets } from "./lib/assets";
import { emit } from "./lib/events";
import { zzfx } from "./lib/zzfx";

export default function createEnemy (props = {}) {
  const explosionColors = [null, null, null, 'purple', 'red', 'cyan', 'green', 'yellow', 'pink', 'orange'];
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

      Math.random() > 0.995 && emit('enemy-fire', this, this.rotate ? 1 : 0);

      this.hitTimer > 0 && this.hitTimer++;
      this.fireTimer++;

      this._update();

      this.ttl <= 0 && this.dying && (emit('explosion', this.x, this.y, this.isBoss ? 60 : 20, this.isBoss ? 10 : 5, explosionColors[this.sprite]));
    },
    draw() {
      const { context: ctx } = this;
      // @todo drawing only after frame 1 to avoid scale flickering
      this.frame > 1 && !this.isBoss && ctx.drawImage(this.image, 8 * this.sprite, 0, 8, 8, 0, 0, 8, 8);
      this.frame > 1 && this.isBoss && ctx.drawImage(this.image16, 0, 0, 16, 16, 0, 0, 16, 16);

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
};