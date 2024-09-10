import { scene } from "../engine/scene";
import starfield from "../entities/starfield";
import { onKey } from "../engine/keyboard";
import { emit, on } from "../engine/events";
import { delay, rnd } from "../engine/utils";
import { text } from "../engine/text";
import { pool } from "../engine/pool";
import { explosionParticle } from "../entities/explosion-particle";
import { zzfxP } from "../engine/zzfx";
import { dataAssets } from "../engine/assets";

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
    y: 80,
    text: 'YOUR SCORE:',
    color: 'white',
    align: 'center',
  });

  const scoreText = text({
    x: 128,
    y: 96,
    text: `${score}`,
    color: 'white',
    align: 'center',
    scaleX: 2,
    scaleY: 2,
  });

  const hiscoreText = text({
    x: 128,
    y: 128,
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
    s.add(titleText);
    emit('explosion', 128, 48, 100, 6, 'red');
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
      emit('explosion', 128, 132, 60, 4, 'yellow');
    }, 3000);
  }

  return s;
}
