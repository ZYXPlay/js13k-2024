import { scene } from "../engine/scene";
import starfield from "../entities/starfield";
import { onKey } from "../engine/keyboard";
import { emit, on } from "../engine/events";
import { clamp, delay, rnd } from "../engine/utils";
import { text } from "../engine/text";
import { pool } from "../engine/pool";
import { explosionParticle } from "../entities/explosion-particle";
import { zzfxP } from "../engine/zzfx";
import { dataAssets, imageAssets } from "../engine/assets";
import { gameObject } from "../engine/game-object";

export default function gameOverScene(
  {
    score = 0,
    previous = localStorage.getItem('hiScore') || 0
  } = {}
) {
  onKey(['enter'], () => {
    emit('change-scene', 'menu');
  });

  on('explosion', (x, y, volume, magnitude, color) => {
    zzfxP(dataAssets['explosion']);

    for (let i = 0; i < volume; i++) {
      explosionPool.get({
        x,
        y,
        dx: rnd(- magnitude / 2, magnitude / 2),
        dy: rnd(- magnitude / 2, magnitude / 2),
        color,
        ttl: 30 * magnitude,
      });
    }
  });

  const starPool = starfield(1);

  const explosionPool = pool({
    create: explosionParticle,
    maxSize: 400,
  });

  const title = gameObject({
    x: 128,
    y: 48,
    anchor: { x: 0.5, y: 0.5 },
    width: 256,
    height: 100,
    scaleX: 0.01,
    scaleY: 0.01,
    image: imageAssets['gameover.png'],
    update() {
      // this.scaleX = this.scaleY = 0.95 + Math.sin(this.frame / 10) * 0.05;
      this.scaleX = this.scaleY = clamp(0, 1, this.frame / 200);
      this.advance();
    },
    draw() {
      if (this.frame < 2) return;
      const { context: ctx } = this;
      ctx.drawImage(this.image, 0, 0);
    },
  });

  const titleText = text({
    x: 128,
    y: 32,
    text: 'GAME OVER',
    align: 'center',
    color: 'red',
    scaleX: 2,
    scaleY: 4,
  });

  const scoreLabelText = text({
    x: 128,
    y: 128,
    text: 'YOUR SCORE:',
    color: 'white',
    align: 'center',
  });

  const scoreText = text({
    x: 128,
    y: 144,
    text: `${score}`,
    color: 'white',
    align: 'center',
    scaleX: 2,
    scaleY: 2,
  });

  const hiscoreText = text({
    x: 128,
    y: 180,
    text: 'NEW HIGH SCORE!',
    color: 'yellow',
    align: 'center',
  });

  const startText = text({
    x: 128,
    y: 240 - 16,
    text: 'ENTER TO CONTINUE',
    color: 'lightgreen',
    align: 'center',
  });

  const s = scene({
    frame: 0,
    children: [
      starPool,
      startText,
      explosionPool,
    ],
    // update() {
    //   this.frame > 40 && this.frame < 140 && this.frame % 20 === 0 && starPool.decreaseVel(2);
    //   this.frame++;
    // }
  });

  delay(() => {
    s.add(title);
    // emit('explosion', 128, 48, 100, 6, 'red');
  }, 1000);

  delay(() => {
    s.add(scoreLabelText);
  }, 2000);

  delay(() => {
    s.add(scoreText);
  }, 2500);

  if (score > previous) {
    delay(() => {
      s.add(hiscoreText);
      emit('explosion', 128, 180, 60, 4, 'yellow');
    }, 3000);
  }

  return s;
}
