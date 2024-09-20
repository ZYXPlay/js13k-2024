import { gameObject } from "../engine/game-object";
import { scene } from "../engine/scene";

export default function playerScene() {
  const player = gameObject({
    x: 128,
    y: 128,
    width: 16,
    height: 16,
    anchor: { x: 0.5, y: 0.5 },
    update() {
      this.advance();
    },
    draw() {
      const { context: ctx } = this;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, this.width, this.height);
    },
  });
  const s = scene({
    frame: 0,
    children: [
      player,
    ],
  });
  return s;
}
