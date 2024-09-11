import { scene } from "../engine/scene";
import { text } from "../engine/text";
import { delay } from "../engine/utils";
import { emit } from "../engine/events";

export default function loadingScene() {
  const loadingText = text({
    x: 128,
    y: 120,
    text: 'LOADING',
    color: 'lightgreen',
    align: 'center',
  });

  delay(async () => {
    emit('change-scene', 'menu');
  },500);

  return scene({
    frame: 0,
    children: [loadingText],
  });
};