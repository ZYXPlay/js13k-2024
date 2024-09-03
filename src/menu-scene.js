import { emit } from "./lib/events";
import { onKey } from "./lib/keyboard";
import scene from "./lib/scene";
import text from "./lib/text";
import starfield from "./starfield";

export default function menuScene() {
  onKey(['enter'], () => {
    emit('change-scene', 'game');
  });

  const hiscore = localStorage.getItem('hiscore') || 0;
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
  const hiscoreText = text({
    text: `HIGH SCORE ${hiscore}`,
    x: 128,
    y: 120,
    align: 'center',
    color: 'yellow',
  });
  const pressText = text({
    text: 'PRESS ENTER TO START',
    x: 128,
    y: 144,
    align: 'center',
    color: 'lightgreen',
  });
  const controlsText = text({
    text: 'ARROWS TO MOVE\nSPACE TO SHOOT',
    x: 128,
    y: 192,
    align: 'center',
  });
  return scene({
    objects: [starField, titleText, subtitleText, hiscoreText, pressText, controlsText],
  });
}
