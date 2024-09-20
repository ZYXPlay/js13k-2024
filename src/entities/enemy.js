import { emit } from "../engine/events";
import { GameObject } from "../engine/game-object";
import { angleToTarget, clamp, degToRad } from "../engine/utils";

export class Enemy extends GameObject {
  init(props) {
    const properties = {
      name: 'enemy',
      sprite: 3,
      color: null,
      anchor: { x: .5, y: .5 },
      shield: 1,
      frame: 0,
      loop: true,
      firstRun: true,
      debryColor: 'white',
      fireRate: 200,
      speed: 1,
      ...props,
    };

    super.init(properties);
    this.path && (this.ttl = Math.floor(properties.path.getTotalLength() / this.speed));
    this.loop && (this.ttl = Infinity);
  }
  fire() {
    emit('enemy-fire', this.x - 4, this.y - 4, this.rotation, 3);
  }
  die() {
    emit('explosion', this.x, this.y, 20, 3, this.debryColor);
    emit('score', 10);
    this.ttl = 0;
  }
  update () {
    this.rotation = degToRad(180);

    if (this.path) {
      const xy = this.path.getPointAtLength(this.frame * this.speed);
      const nextXy = this.path.getPointAtLength(this.frame * this.speed + 1);
      this.x = Math.floor(xy.x);
      this.y = Math.floor(xy.y);
      this.rotate && (this.rotation = degToRad(90) + (angleToTarget(xy, nextXy)));
    } else {
      this.x = this.parent.x + Math.cos(this.frame / this.parent.childrenSpeed + this.anglePlacement) * this.parent.childrenRadius;
      this.y = this.parent.y + Math.sin(this.frame / this.parent.childrenSpeed + this.anglePlacement) * this.parent.childrenRadius;
    }

    // if (this.rotate) {
    //   this.rotation = degToRad(90) + (angleToTarget(xy, nextXy));
    // } else {
    //   this.rotation = degToRad(180);
    // }

    this.firstRun && (this.scaleX = this.scaleY = clamp(0, 1, (this.frame * this.speed + 1) / 100));
    !this.loop && this.ttl < (100) && (this.scaleX = this.scaleY = clamp(0, 1, (this.ttl) / 100));

    // Imunity via scale? why not?
    this.scaleX < 1 && (this.imune = true);
    this.scaleX >= 1 && (this.imune = false);

    // Only fire when the enemy is fully visible, using scale...
    this.scaleX == 1 && this.frame % this.fireRate === 0 && this.fire();

    this.path && (this.frame * this.speed) >= this.path.getTotalLength() && this.loop && (this.frame = 0, this.firstRun = false);

    this.frame++;
    this.ttl--;
  }
}

export function enemy(props) {
  return new Enemy(props);
}