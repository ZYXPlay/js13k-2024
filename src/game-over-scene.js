import { emit } from "./lib/events";
import { onKey } from "./lib/keyboard";
import scene from "./lib/scene";
import text from "./lib/text";
import starfield from "./starfield";

export default function gameOverScene(options) {
  const { score } = options;
  onKey(['enter'], () => {
    emit('change-scene', 'menu');
  });

  const starField = starfield();

  const titleText = text({
    text: 'GAME OVER',
    x: 128,
    y: 48,
    align: 'center',
    scale: 2,
    color: 'red',
  });
  const subtitleText = text({
    text: `SCORE ${score}`,
    x: 128,
    y: 96,
    align: 'center',
  });
  const pressText = text({
    text: 'PRESS ENTER TO CONTINUE',
    x: 128,
    y: 144,
    align: 'center',
    color: 'yellow',
  });
  return scene({
    objects: [starField, titleText, subtitleText, pressText],
  });
}
