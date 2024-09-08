import { gameObject } from "../engine/game-object";
import { pool } from "../engine/pool";
import { rnd } from "../engine/utils";

export default function starfield(vel = 1) {
  const starPool = pool({
    create: gameObject,
    maxSize: 241,
  });

  starPool.increaseVel = function (v) {
    this.objects.forEach(star => {
      star.dy = star.dy * v;
    });
  }

  starPool.decreaseVel = function (v) {
    this.objects.forEach(star => {
      star.dy = star.dy / v;
    });
  }

  starPool.velocity = vel;

  for (let i = 0; i < 240; i++) {
    const velocity = rnd(1, 3) * vel;
    const color = Math.floor((velocity / vel) * 50) + 50;
    starPool.get(
      {
        x: Math.floor(rnd(0, 256)),
        y: i,
        width: 1,
        height: 1,
        dy: velocity / 4,
        color: `rgb(${color}, ${color}, ${color})`,
        update() {
          this.advance();
          if (this.y > 240) {
            this.y = 0;
          }
        },
      }
    );
  }

  starPool.isAlive = () => true;
  return starPool;
}