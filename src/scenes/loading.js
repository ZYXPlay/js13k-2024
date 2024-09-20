import { scene } from "../engine/scene";
import { text } from "../engine/text";
import { delay } from "../engine/utils";
import { emit } from "../engine/events";
import { onKey } from "../engine/keyboard";

export default function loadingScene() {
  onKey(['enter'], () => {
    emit('change-scene', 'menu');
  });

  const loadingText = text({
    x: 128,
    y: 120,
    text: 'LOADING',
    color: 'lightgreen',
    align: 'center',
  });

  delay(async () => {
    loadingText.text = 'PRESS ENTER TO CONTINUE';
    // emit('change-scene', 'menu');
  },1000);

  return scene({
    id: 'loading',
    frame: 0,
    children: [loadingText],
  });
};