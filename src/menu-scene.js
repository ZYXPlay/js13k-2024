import { emit } from "./lib/events";
import { onKey } from "./lib/keyboard";
import scene from "./lib/scene";
import text from "./lib/text";
import starfield from "./starfield";

export default function menuScene() {
  onKey(['enter'], () => {
    emit('change-scene', 'game');
  });

  const starField = starfield();

  const titleText = text({
    text: 'MICRO SHOOTER',
    x: 128,
    y: 48,
    align: 'center',
    scale: 2,
    color: 'red',
  });
  const subtitleText = text({
    text: 'JS13K 2024 EDITION',
    x: 128,
    y: 96,
    align: 'center',
  });
  const pressText = text({
    text: 'PRESS ENTER TO START',
    x: 128,
    y: 144,
    align: 'center',
    color: 'yellow',
  });
  const controlsText = text({
    text: 'ARROWS TO MOVE\nSPACE TO SHOOT',
    x: 128,
    y: 192,
    align: 'center',
  });
  return scene({
    objects: [starField, titleText, subtitleText, pressText, controlsText],
  });
}
