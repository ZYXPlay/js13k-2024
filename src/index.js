import gameLoop from "./engine/game-loop";
import { setContext } from "./engine/utils";
import gameScene from "./scenes/game-scene";
import { initKeys } from "./engine/keyboard";
import { loadImage } from "./engine/assets";
import { callbacks, clearEvents, on } from "./engine/events";
import menuScene from "./scenes/menu-scene";
import gameOverScene from "./scenes/game-over-scene";

const ctx = setContext(document.getElementById('c').getContext('2d'));
ctx.imageSmoothingEnabled = false;
ctx.setTransform(1, 0, 0, 1, 0, 0);
ctx.filter = 'url(#remove-alpha)';

(async () => {
  initKeys();

  await loadImage('font.png');
  await loadImage('spritesheet.png');
  await loadImage('spritesheet16.png');

  function changeScene(scene, props) {
    clearEvents(['change-scene']);
    ctx.filter = 'url(#remove-alpha)';
    switch (scene) {
      case 'game':
        currentScene = gameScene();
        break;
      case 'menu':
        currentScene = menuScene();
        break;
      case 'game-over':
        console.log('game-over', props);
        currentScene = gameOverScene(props);
        break;

      default:
        break;
    }
  }

  on('change-scene', (scene, props) => changeScene(scene, props));

  let currentScene = menuScene();

  const loop = gameLoop({
    update(dt) {
      currentScene.update(dt);
    },
    render() {
      currentScene.render();
    }
  });

  loop.start();

})();
