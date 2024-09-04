import gameObject from "./lib/game-object";
import { getContext } from "./lib/utils";
import { imageAssets } from "./lib/assets";
import { keyPressed } from "./lib/keyboard";
import { emit } from "./lib/events";
import { zzfx } from "./lib/zzfx";

export default function createShip() {
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

      keyPressed(['d', 'arrowright']) && this.dx < 5 && (this.ddx = .2, this.sprite = 2);
      keyPressed(['a', 'arrowleft']) && this.dx > -5 && (this.ddx = -.2, this.sprite = 0);

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
        keyPressed(['s', 'arrowdown']) && this.dy < 5 && (this.ddy = .2);
        keyPressed(['w', 'arrowup']) && this.dy > -5 && (this.ddy = -.2);
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
};