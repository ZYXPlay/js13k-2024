import { imageAssets } from "../engine/assets";
import { emit } from "../engine/events";
import { delay } from "../engine/utils";
import { Enemy } from "./enemy";

export class Boss extends Enemy {
  init(props) {
    const properties = {
      name: 'boss',
      spritesheet: [imageAssets['spritesheet16.png'], 16, 16],
      sprite: 0,
      width: 16,
      height: 16,
      color: null,
      shield: 10,
      debryColor: 'white',
      fireRate: 200,
      firing: false,
      loop: false,
      imune: true,
      showStatus: false,
      timers: [],
      ...props,
    };

    super.init(properties);

    this.maxShield = this.shield;
  }
  hit(damage) {
    super.hit(damage);
    this.showStatus = true;
    delay(() => {this.showStatus = false;}, 1000);
  }
  fire() {
    this.firing = true;
    this.imune = false;
    this.timers[0] = delay(() => {emit('boss-fire', this.x, this.y, this.rotation, 3);}, 400);
    this.timers[1] = delay(() => {emit('boss-fire', this.x, this.y, this.rotation, 3);}, 800);
    this.timers[2] = delay(() => {emit('boss-fire', this.x, this.y, this.rotation, 3);}, 1200);
    delay(() => {this.firing = false; this.imune = true;}, 1600);
  }
  die() {
    emit('explosion', this.x, this.y, 30, 3, this.debryColor);
    emit('score', 10);
    this.ttl = 0;
    this.timers.map(timer => clearTimeout(timer));
    emit('boss-die');
  }
  update() {
    !this.firing && super.update();
    !this.firing && (this.imune = true);
  }
  draw() {
    super.draw();

    if (!this.showStatus) return;

    const { context: ctx } = this;
    const bar = 20 * this.shield / this.maxShield;

    ctx.save();

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
}

export function boss(props) {
  return new Boss(props);
}