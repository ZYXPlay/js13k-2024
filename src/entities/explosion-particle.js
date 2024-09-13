import { GameObject } from "../engine/game-object";

export class ExplosionParticle extends GameObject {
  constructor(props) {
    const properties = {
      name: 'explosion-particle',
      color: 'white',
      anchor: { x: .5, y: .5 },
      ...props,
    };
    super(properties);
  }
  update() {
    !this.color && this.ttl < 30 && (this.scaleX = this.scaleY = this.ttl / 30);
    this.color && this.ttl < 60 && (this.scaleX = this.scaleY = this.ttl / 60);
    this.advance();
  }
  draw() {
    !this.color && this.context.drawImage(
      this.spritesheet[0],
      120, 0, 8, 8,
      0, 0, 8, 8
    );

    this.color && (
      this.context.fillStyle = this.color,
      this.context.fillRect(0, 0, 1, 1)
    );
  }
}

export function explosionParticle(props) {
  return new ExplosionParticle(props);
}