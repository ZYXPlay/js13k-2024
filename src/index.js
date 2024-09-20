import gameLoop from "./engine/game-loop";
import { setContext } from "./engine/utils";
import gameScene from "./scenes/game-scene";
import { initKeys } from "./engine/keyboard";
import { loadData, loadImage } from "./engine/assets";
import { clearEvents, on } from "./engine/events";
import menuScene from "./scenes/menu-scene";
import gameOverScene from "./scenes/game-over-scene";
import playerScene from "./scenes/player-scene";
import zzfxm from "./engine/zzfxm";
import { zzfxG } from "./engine/zzfx";
import song1 from "./songs/depp";
import explosion from "./sounds/explosion";
import shoot from "./sounds/shoot";
import typing from "./sounds/typing";
import powerup from "./sounds/powerup";
import transition from "./sounds/transition";
import shoot2 from "./sounds/shoot2";
import hit from "./sounds/hit";
import bigExplosion from "./sounds/big-explosion";
import engineSlowdown from "./sounds/engine-slowdown";
import loadingScene from "./scenes/loading";
import title from "./images/title";
import gameOver from "./images/game-over";
import saturn from "./images/saturn";
import font from "./images/font";

const ctx = setContext(document.getElementById('c').getContext('2d', { willReadFrequently: true }));
ctx.imageSmoothingEnabled = false;
ctx.setTransform(1, 0, 0, 1, 0, 0);
BassoonTracker.init(true);

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
  await loadData('engineSlowdown', zzfxG, engineSlowdown);
  await loadData('bigExplosion', zzfxG, bigExplosion);
  // await loadImage('font.png');
  await loadImage('spritesheet.png');
  await loadImage('spritesheet16.png');

  const titleImage = title();
  await titleImage.generate(256, 240);
  await loadImage('title.png', titleImage.image);

  const gameOverImage = gameOver();
  await gameOverImage.generate(256, 240);
  await loadImage('gameover.png', gameOverImage.image);

  const saturnImage = await saturn();
  await saturnImage.generate(256, 240);
  await loadImage('saturn.png', saturnImage.image);

  let fontImage = await font();
  await fontImage.generate(378, 9);
  await loadImage('font-white.png', fontImage.image);
  fontImage = await font('yellow');
  await fontImage.generate(378, 9);
  await loadImage('font-yellow.png', fontImage.image);
  fontImage = await font('red');
  await fontImage.generate(378, 9);
  await loadImage('font-red.png', fontImage.image);
  fontImage = await font('green');
  await fontImage.generate(378, 9);
  await loadImage('font-green.png', fontImage.image);
  fontImage = await font('lightgreen');
  await fontImage.generate(378, 9);
  await loadImage('font-lightgreen.png', fontImage.image);
  fontImage = await font('gray');
  await fontImage.generate(378, 9);
  await loadImage('font-gray.png', fontImage.image);
  fontImage = await font('lightblue');
  await fontImage.generate(378, 9);
  await loadImage('font-lightblue.png', fontImage.image);

  function changeScene(scene, props) {
    let track = 'menu.mod';
    clearEvents(['change-scene']);

    switch (scene) {
      case 'menu':
        track = "menu.mod";
        currentScene = menuScene();
        break;
      case 'game':
        track = "music.xm";
        currentScene = gameScene();
        break;
      case 'game-over':
        track = "game-over.mod";
        currentScene = gameOverScene(props);
        break;

      default:
        break;
    }
    BassoonTracker.load(track,true);
  }

  on('change-scene', (scene, props) => changeScene(scene, props));

  let currentScene = loadingScene();
  let overlayScene = playerScene();

  const loop = gameLoop({
    update(dt) {
      currentScene.update(dt);
      // currentScene.id !== 'loading' && overlayScene.update(dt);
    },
    render() {
      currentScene.render();
      // currentScene.id !== 'loading' && overlayScene.render();
    }
  });

  loop.start();

})();
