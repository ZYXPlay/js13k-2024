import gameObject from "./lib/game-object";
import pool from "./lib/pool";
import { getContext } from "./lib/utils";

export default function starfield() {
  const ctx = getContext();
  const starPool = pool({
    create: gameObject,
    maxSize: 300,
  });

  function createStar(y) {
    const starVel = (Math.random() * 2) + .1;
    const starColor = 0 + starVel * 96;

    starPool.get({
      id: 'star',
      x: Math.random() * ctx.canvas.width,
      y,
      dx: 0,
      dy: starVel,
      width: 1,
      height: 1,
      ttl: 240 / starVel,
      update() {
        this.advance();
        this.y > ctx.canvas.height && (this.ttl = 0);
      },
      draw() {
        const { context: ctx } = this;
        ctx.fillStyle = `rgb(${starColor}, ${starColor}, ${starColor})`;
        ctx.fillRect(0, 0, this.width, this.height);
      },
    });
  };

  for (let y = 0; y < ctx.canvas.height; y += 2) {
    createStar(y);
  }

  return {
    update() {
      createStar(-1);
      starPool.update();
    },
    render() {
      starPool.render();
    },
  };
}