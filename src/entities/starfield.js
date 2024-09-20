import { gameObject } from "../engine/game-object";
import { pool } from "../engine/pool";
import { rnd } from "../engine/utils";
import { ch, cw } from "../globals";

export default function starfield(vel = 1) {
  const starPool = pool({
    create: gameObject,
    maxSize: 480,
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

  for (let i = -10; i < ch; i++) {
    const velocity = rnd(1, 3) * vel;
    const color = Math.floor((velocity / vel) * 50) + 50;
    i % 2 == 0 && starPool.get(
      {
        x: Math.floor(rnd(0, cw)),
        y: i,
        width: 1,
        height: 1 + (velocity / 4),
        dy: velocity / 4,
        color: `rgb(${color}, ${color}, ${color})`,
        update() {
          this.advance();
          if (this.y > ch) {
            this.y = -10;
          }
          this.height = 1 + (this.dy / 4);
        },
      }
    );
  }

  starPool.isAlive = () => true;
  return starPool;
}