import { scene } from "../engine/scene";
import starfield from "../entities/starfield";
import { onKey, offKey } from "../engine/keyboard";
import { emit } from "../engine/events";
import { delay } from "../engine/utils";
import { text } from "../engine/text";

export default function menuScene() {
  onKey(['enter'], () => {
    emit('change-scene', 'game');
  });
  offKey(['esc']);
  const starPool = starfield(20);

  const titleText = text({
    x: 128,
    y: 32,
    text: 'MICRO SHOOTER',
    align: 'center',
    color: 'red',
    scaleX: 2,
    scaleY: 4,
  });

  const editionText = text({
    x: 128,
    y: 88,
    text: 'JS13K 2024 EDITION',
    align: 'center',
    color: 'yellow',
  });

  const gameByText = text({
    x: 128,
    y: 128,
    text: 'A GAME BY\nMARCO FERNANDES',
    lineHeight: 16,
    color: 'white',
    align: 'center',
  });

  const controlsText = text({
    x: 128,
    y: 128 + 48,
    text: 'ARROWS OR WASD TO MOVE\nSPACE TO SHOOT',
    lineHeight: 16,
    align: 'center',
  });

  const startText = text({
    x: 128,
    y: 240 - 16,
    text: 'ENTER TO START',
    color: 'lightgreen',
    align: 'center',
  });

  const s = scene({
    frame: 0,
    children: [
      starPool,
      startText,
    ],
    update() {
      this.frame > 40 && this.frame < 140 && this.frame % 20 === 0 && starPool.decreaseVel(2);
      this.frame++;
    }
  });

  delay(() => {
    s.add(titleText);
  }, 1000);

  delay(() => {
    s.add(editionText);
  }, 2000);

  delay(() => {
    s.add(gameByText);
  }, 3000);

  delay(() => {
    s.add(controlsText);
  }, 4000);

  return s;
}
