import { dataAssets } from "../engine/assets";
import { emit } from "../engine/events";
import { GameObject } from "../engine/game-object";
import { keyPressed } from "../engine/keyboard";
import { clamp, delay, rnd } from "../engine/utils";
import { zzfxP } from "../engine/zzfx";

export class Ship extends GameObject {
  init(props) {
    const properties = {
      name: 'ship',
      spawning: true,
      y: 248,
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
      this.shield += 50;
      this.shield > 100 && (this.shield = 100);
    }

    if (powerup.type === 'fire') {
      this.fireLevel++;
      this.fireLevel > 4 && (this.fireLevel = 4);
      clearTimeout(this.fireTimeout);
      this.fireTimeout = delay(() => {
        this.fireLevel === 4 && (this.fireLevel = 3);
      }, 30000);
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

    if (this.fireLevel  > 2) {
      delay(() => {
        emit('ship-fire', this.x - 1, this.y - 8, -2);
        emit('ship-fire', this.x - 1, this.y - 8, 2);
      }, 400);
    }

    if (this.fireLevel  > 3) {
      delay(() => {
        emit('ship-fire', this.x - 16, this.y - 4, rnd(-.1, .1));
        emit('ship-fire', this.x + 14, this.y - 4, rnd(-.1, .1));
      }, 200);
    }

    delay(() => {
      this.firing = false;
    }, 200);
  }
  die() {
    emit('ship-die');
    emit('explosion', this.x, this.y - 4, 60, 4, 'white');
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
    this.y = 248;
    this.frame = 0;
    this.shield = 100;
    this.fireLevel = 0;
    delay(() => {
      this.spawning = false;
      this.imune = false;
    }, 1000);
  }
  update() {
    const friction = .96;

    this.ddx = 0;
    this.ddy = 0;

    this.dx *= friction;
    this.dy *= friction;

    this.sprite = 1;

    keyPressed(['d', 'arrowright']) && this.dx < 5 && (this.ddx = .2, this.sprite = 2);
    keyPressed(['a', 'arrowleft']) && this.dx > -5 && (this.ddx = -.2, this.sprite = 0);

    if (!this.spawning) {
      keyPressed(['s', 'arrowdown']) && this.dy < 5 && (this.ddy = .2);
      keyPressed(['w', 'arrowup']) && this.dy > -5 && (this.ddy = -.2);
    }

    !this.firing && keyPressed('space') && this.fire();

    if (this.spawning) {
      this.ddy = -.03;
      this.scaleX = this.scaleY = clamp(1, 2, 2 - this.frame / 60);
    }

    this.shield <= 0 && this.die();

    this.advance();

    this.x < 4 && (this.x = 4, this.dx = 0);
    this.x > 252 && (this.x = 252, this.dx = 0);
    this.y < 4 && (this.y = 4, this.dy = 0);
    this.y > 236 && (this.y = 236, this.dy = 0);
  }
  draw() {
    const { context: ctx, x, y, width, height } = this;
    ctx.drawImage(this.spritesheet[0], this.spritesheet[1] * this.sprite, 0, width, height, 0, 0, width, height);

    let boost = 1;
    this.ddy < 0 && (boost = this.frame % 10 < 5 ? 2 : 3);
    ctx.fillStyle = '#FFaa33';
    ctx.fillRect(3, 7, 2, boost);
    ctx.fillStyle = '#FF6633';
    ctx.fillRect(this.frame % 10 < 5 ? 3 : 4, 7 + boost, 1, boost);

    if (this.fireLevel === 4) {
      ctx.fillStyle = '#FFF';
      ctx.fillRect(18, 4, 2, 2);
      ctx.fillRect(-12, 4, 2, 2);
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
