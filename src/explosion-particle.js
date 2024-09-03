import gameObject from "./lib/game-object";
import { degToRad } from "./lib/utils";

export default function createExplosionParticle({
  x = 0,
  y = 0,
  magnitude = 2,
  color = 'red',
} = {}) {
  const obj = gameObject({
    name: 'particle',
    x,
    y,
    width: 2,
    height: 2,
    frame: 0,
    init(properties = {}) {
      let angle = Math.random() * 360;
      this.maxMagnitude = magnitude || 2;
      let magnitudeNew = Math.random() * this.maxMagnitude + this.maxMagnitude;
      console.log('magnitudeNew', this.maxMagnitude);
      this.frame = 0;
      this.ttl = 30 * magnitudeNew;
      this.dx = Math.cos(degToRad(angle)) * magnitudeNew / 10;
      this.dy = Math.sin(degToRad(angle)) * magnitudeNew / 10;
    },
    update() {
      const col = 256 / 30 * this.maxMagnitude * (this.ttl / 30);
      color == 'white' && (this.color = `rgb(${col},${col},${col})`);
      color == 'red' && (this.color = `rgb(${col},0,0)`);
      this._update();
    }
  });
  return obj;
}
