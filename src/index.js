import gameLoop from "./engine/game-loop";
import { setContext } from "./engine/utils";
import gameScene from "./scenes/game-scene";
import { initKeys } from "./engine/keyboard";
import { loadData, loadImage } from "./engine/assets";
import { clearEvents, on } from "./engine/events";
import menuScene from "./scenes/menu-scene";
import gameOverScene from "./scenes/game-over-scene";
import zzfxm from "./engine/zzfxm";
import { zzfxG } from "./engine/zzfx";
import song1 from "./songs/depp";
import explosion from "./sounds/explosion";
import shoot from "./sounds/shoot";
import typing from "./sounds/typing";
import powerup from "./sounds/powerup";
import transition from "./sounds/transition";
import { player } from "./engine/globals";
import shoot2 from "./sounds/shoot2";
import hit from "./sounds/hit";
// import loadingScene from "./scenes/loading";
// import title from "./images/title";

const ctx = setContext(document.getElementById('c').getContext('2d'));
ctx.imageSmoothingEnabled = false;
ctx.setTransform(1, 0, 0, 1, 0, 0);

(async () => {
  initKeys();

  await loadData('song1', zzfxm, song1);
  await loadData('explosion', zzfxG, explosion);
  await loadData('shoot', zzfxG, shoot);
  await loadData('shoot2', zzfxG, shoot2);
  await loadData('typing', zzfxG, typing);
  await loadData('powerup', zzfxG, powerup);
  await loadData('hit', zzfxG, hit);
  await loadData('transition', zzfxG, transition);
  await loadImage('font.png');
  await loadImage('spritesheet.png');
  await loadImage('spritesheet16.png');

  // No space for dithered title image 😥
  // const titleImage = title();
  // await titleImage.generate(256, 240);
  // await loadImage('title.png', titleImage.image);

  function changeScene(scene, props) {
    clearEvents(['change-scene']);
    player.stop();
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
