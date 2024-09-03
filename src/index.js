import gameLoop from "./lib/game-loop";
import { getContext, setContext } from "./lib/utils";
import { initKeys, offKey, onKey } from "./lib/keyboard";
import { loadImage } from "./lib/assets";
import gameScene from "./game-scene";
import menuScene from "./menu-scene";
import gameOverScene from "./game-over-scene";
import { clearEvents, on } from "./lib/events";

const ctx = setContext(document.getElementById('c').getContext('2d'));
ctx.imageSmoothingEnabled = false
ctx.setTransform(1, 0, 0, 1, 0, 0);
ctx.filter = 'url(#remove-alpha)';

initKeys();

function toggleExperience() {
  const ctx = getContext();
  if (ctx.filter === 'url(#remove-alpha)') {
    ctx.filter = 'none';
  } else {
    ctx.filter = 'url(#remove-alpha)';
  }
}

(async () => {
  await loadImage('font.png');
  await loadImage('spritesheet.png');

  onKey('e', toggleExperience);

  on('change-scene', (scene, options) => {
    offKey(['enter', 'esc']);
    clearEvents(['change-scene']);
    scene === 'game' && (currentScene = gameScene());
    scene === 'menu' && (currentScene = menuScene());
    scene === 'game-over' && (currentScene = gameOverScene(options));
  });

  let currentScene = menuScene();
  let frame = 0;
  
  const game = gameLoop({
    update() {
      currentScene.update();
      frame++;
    },
    render() {
      currentScene.render();
    },
  });

  game.start();
})();
