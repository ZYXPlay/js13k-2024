import { dataAssets, imageAssets } from "../engine/assets";
import { emit } from "../engine/events";
import { GameObject } from "../engine/game-object";
import { keyPressed } from "../engine/keyboard";
import { clamp, delay, rnd } from "../engine/utils";
import { zzfxP } from "../engine/zzfx";
import { ch, cw } from "../globals";

export class Ship extends GameObject {
  init(props) {
    const properties = {
      name: 'ship',
      spawning: true,
      y: 248,
      spritesheet: [imageAssets['spritesheet16.png'], 16, 16],
      width: 16,
      height: 16,
      imune: false,
      dying: false,
      shield: 100,
      lives: 3,
      score: 0,
      fireLevel: 0,
      firing: false,
      fireTimeout: null,
      anchor: { x: .5, y: .5 },
      sprite: 1,
      ...props,
    };
    super.init(properties);
    this.spawn();
  }
  powerUp(powerup) {
    zzfxP(dataAssets['powerup']);
    if (powerup.type === 'shield') {
      this.shield += 100;
      this.shield > 100 && (this.shield = 100);
    }

    const previousType = this.fireType;

    if (powerup.type === 'fire' || powerup.type === 'laser') {
      this.fireType = powerup.type === 'fire' ? 0 : 1;
      this.fireType !== previousType && (this.fireLevel = 0);
      this.fireLevel++;
      this.fireLevel > 4 && (this.fireLevel = 4);
      if (this.fireLevel === 4) {
        clearTimeout(this.fireTimeout);
        emit('start-fire-timer');
        this.fireTimeout = delay(() => {
          emit('end-fire-timer');
          this.fireLevel === 4 && (this.fireLevel = 3);
        }, 30000);
      }
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

    if (this.fireLevel > 2) {
      delay(() => {
        emit('ship-fire', this.x - 1, this.y - 8, -2);
        emit('ship-fire', this.x - 1, this.y - 8, 2);
      }, 400);
    }

    if (this.fireLevel > 3) {
      delay(() => {
        emit('ship-fire', this.x - 16, this.y - 4, rnd(-.1, .1));
        emit('ship-fire', this.x + 14, this.y - 4, rnd(-.1, .1));
      }, 200);
    }

    delay(() => {
      this.firing = false;
    }, 200);
  }
  fire2() {
    if (this.firing) return;
    this.firing = true;
    let repeat = 200;
    emit('ship-fire-laser', this.x - 1, this.y - 16, 0);

    if (this.fireLevel > 0) {
      delay(() => {
        emit('ship-fire-laser', this.x - 6, this.y - 10, 0);
      }, 20);
      delay(() => {
        emit('ship-fire-laser', this.x + 5, this.y - 10, 0);
      }, 40);
    }

    if (this.fireLevel > 1) {
      repeat = 150;
    }

    if (this.fireLevel > 2) {
      repeat = 100;
    }

    if (this.fireLevel > 3) {
      delay(() => {
        emit('ship-fire-laser', this.x - 16, this.y - 16, 0);
      }, 60);
      delay(() => {
        emit('ship-fire-laser', this.x + 14, this.y - 16, 0);
      }, 80);
    }

    delay(() => {
      this.firing = false;
    }, repeat);
  }
  die() {
    emit('ship-die');
    emit('explosion', this.x, this.y - 4, 60, 4, 'white', true);
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
    this.y = ch + 32;
    this.frame = 0;
    this.shield = 100;
    this.fireLevel = 0;
    this.fireType = 0;
    delay(() => {
      this.spawning = false;
      this.imune = false;
    }, 1000);
  }
  update() {
    const friction = .91;

    this.ddx = 0;
    this.ddy = 0;

    this.dx *= friction;
    this.dy *= friction;

    this.sprite = 2;

    keyPressed(['d', 'arrowright']) && this.dx < 2 && (this.ddx = .3, this.sprite = 3);
    keyPressed(['a', 'arrowleft']) && this.dx > -2 && (this.ddx = -.3, this.sprite = 4);

    if (!this.spawning) {
      keyPressed(['s', 'arrowdown']) && this.dy < 2 && (this.ddy = .3);
      keyPressed(['w', 'arrowup']) && this.dy > -2 && (this.ddy = -.3);
    }

    !this.firing && keyPressed('space') && this.fireType === 0 && this.fire();
    !this.firing && keyPressed('space') && this.fireType === 1 && this.fire2();

    if (this.spawning) {
      this.ddy = -.1;
      this.scaleX = this.scaleY = clamp(1, 2, 2 - this.frame / 60);
    }

    this.shield <= 0 && this.die();

    this.advance();

    this.x < 4 && (this.x = 4, this.dx = 0);
    this.x > cw - 4 && (this.x = cw - 4, this.dx = 0);
    this.y < 4 && (this.y = 4, this.dy = 0);
    this.y > ch - 4 && (this.y = ch - 4, this.dy = 0);
  }
  draw() {
    const { context: ctx, x, y, width, height } = this;
    ctx.drawImage(this.spritesheet[0], this.spritesheet[1] * this.sprite, 0, width, height, 0, 0, width, height);

    let boost = 1;
    this.ddy < 0 && (boost = this.frame % 10 < 5 ? 2 : 3);
    ctx.fillStyle = '#FFaa33';
    ctx.fillRect(7, 13, 2, boost);
    ctx.fillStyle = '#FF6633';
    ctx.fillRect(this.frame % 10 < 5 ? 7 : 8, 13 + boost, 1, boost);

    if (this.fireLevel === 4) {
      ctx.fillStyle = '#FFF';
      ctx.fillRect( 22, 4, 2, 2);
      ctx.fillRect(-8, 4, 2, 2);
    }

    if (this.hitted) {
      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
    }

  }
}

export function ship(props) { return new Ship(props); }
