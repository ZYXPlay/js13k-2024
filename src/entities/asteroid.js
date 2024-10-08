import { imageAssets } from "../engine/assets";
import { emit } from "../engine/events";
import { GameObject } from "../engine/game-object";
import { cw, ch } from "../globals";

export class Asteroid extends GameObject {
  init(props) {
    const properties = {
      name: 'asteroid',
      spritesheet: [imageAssets['spritesheet16.png'], 16, 16],
      sprite: 1,
      width: 16,
      height: 16,
      color: null,
      anchor: { x: .5, y: .5 },
      shield: 10,
      ...props,
    };
    super.init(properties);
  }
  die() {
    emit('explosion', this.x, this.y, 50, 4, 'white');
    emit('score', 10);
    this.ttl = 0;
  }
  update() {
    this.rotation = this.frame / (10 / this.dy);
    this.advance();
    this.x < 0 || this.x > cw + 8 || this.y > ch + 8 && (this.ttl = 0);
  }
}

export function asteroid(props) {
  return new Asteroid(props);
}