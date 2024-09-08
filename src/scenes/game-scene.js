import { clearEvents, emit, on } from "../engine/events";
import { gameObject } from "../engine/game-object";
import { scene } from "../engine/scene";
import { text } from "../engine/text";
import { explosionParticle } from "../entities/explosion-particle";
import { ship } from "../entities/ship";
import { pool } from "../engine/pool";
import starfield from "../entities/starfield";
import { zzfx, zzfxP } from "../engine/zzfx";
import { asteroid } from "../entities/asteroid";
import { quadtree } from "../engine/quad-tree";
import { createPath, degToRad, delay, getContext, rnd } from "../engine/utils";
import { enemy } from "../entities/enemy";
import { boss } from "../entities/boss";
import { dialog } from "../entities/dialog";
import { checkCollisions } from "./game-collisions";
import { offKey, onKey } from "../engine/keyboard";
import { powerup } from "../entities/powerup";
import { getLevelLastFrame, processLevel, totalLevels } from "../levels";
import { dataAssets } from "../engine/assets";
import { player } from "../engine/globals";

export default function gameScene() {
  onKey(['esc'], () => {
    emit('change-scene', 'menu');
  });
  onKey(['p'], () => {
    emit('pause');
  });
  offKey(['enter']);

  player.play('song');
  player.setLoop(true);

  const shipInstance = ship({ x: 120, y: 248 });
  const starPool = starfield(20);
  const dialogInstance = dialog();
  onKey(['enter'], () => dialogInstance.skip());
  const ctx = getContext();
  let currentLevel = 0, virtualLevel = 0;
  let frame = 0;
  let firstRun = true;
  let canSpawnBoss = false;
  let levelLastFrame = getLevelLastFrame(currentLevel);

  const explosionPool = pool({
    create: explosionParticle,
    maxSize: 400,
  });

  const shipBulletPool = pool({
    create: gameObject,
    maxSize: 40,
  });

  const enemyBulletPool = pool({
    create: gameObject,
    maxSize: 400,
  });

  const asteroidPool = pool({
    create: asteroid,
    maxSize: 10,
  });

  const enemyPool = pool({
    create: enemy,
    maxSize: 50,
  });

  const bossPool = pool({
    create: boss,
    maxSize: 4,
  });

  const powerupPool = pool({
    create: powerup,
    maxSize: 4,
  });

  const textScore = text({
    text: 'SCORE 00000',
    x: 8,
    y: 8,
  });

  const textLives = text({
    x: 256 - 8 - 8 * 3,
    y: 8,
    text: '@@@',
    color: 'red',
  });

  const levelText = text({
    x: 128,
    y: 120,
    text: 'LEVEL 1',
    align: 'center',
    color: 'lightgreen',
  });

  const progressShield = gameObject({
    x: 256 - 8 * 8,
    y: 8,
    width: 24,
    height: 8,
    anchor: { x: 0, y: 0 },
    draw() {
      const { context: ctx } = this;
      const value = shipInstance.shield >= 0 ? shipInstance.shield / 5 : 0; // shipInstance.shield >= 0 ? 24 * shipInstance.shield / 100 : 0;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, this.width, this.height);

      ctx.fillStyle = 'green';
      shipInstance.shield < 25 && (ctx.fillStyle = 'red');
      ctx.fillRect(2, 2, value, this.height - 4);
    }
  });

  on('hit', () => {
    zzfx(...[2.3, , 330, , .06, .17, 2, 3.7, , , , , .05, .4, 2, .5, .13, .89, .05, .17]); // Hit 56
  });

  on('explosion', (x, y, volume, magnitude, color) => {
    zzfx(...[, , 45, .03, .21, .6, 4, .9, 2, -3, , , , .2, , .9, , .45, .26]); // Explosion 39

    for (let i = 0; i < volume; i++) {
      i % 2 == 0 && explosionPool.get({
        x,
        y,
        dx: rnd(-1, 1) / 2,
        dy: rnd(-1, 1) / 2,
        color: null,
        ttl: 30,
      });

      explosionPool.get({
        x,
        y,
        dx: rnd(- magnitude / 2, magnitude / 2),
        dy: rnd(- magnitude / 2, magnitude / 2),
        color,
        ttl: 30 * magnitude,
      });
    }
  });

  on('ship-fire', (x, y, dx) => {
    zzfx(...[.9, , 413, , .05, .01, 1, 3.8, -3, -13.4, , , , , , , .11, .65, .07, , 237]); // Shoot 124
    shipBulletPool.get({
      name: 'ship-bullet',
      x,
      y,
      width: 2,
      height: 4,
      dy: -4,
      dx,
      color: null,
      sprite: 17,
      ttl: 100,
      update() {
        this.advance();
        if (this.y < 0) this.ttl = 0;
      }
    });
  });

  on('enemy-fire', (x, y) => {
    zzfx(...[.9, , 413, , .05, .01, 1, 3.8, -3, -13.4, , , , , , , .11, .65, .07, , 237]); // Shoot 124
    const vx = (shipInstance.x - 4) - x;
    const vy = (shipInstance.y - 4) - y;
    const dist = Math.hypot(vx, vy) / 1;

    enemyBulletPool.get({
      name: 'enemy-bullet',
      x: x + 4,
      y: y + 4,
      dx: vx / dist,
      dy: vy / dist,
      width: 2,
      height: 2,
      color: 'red',
      ttl: 200,
    });
  });

  on('boss-fire', (x, y) => {
    zzfx(...[.9, , 413, , .05, .01, 1, 3.8, -3, -13.4, , , , , , , .11, .65, .07, , 237]); // Shoot 124

    for (let i = 0; i < 12; i++) {
      const dx = Math.cos(degToRad(30 * i)) * 1;
      const dy = Math.sin(degToRad(30 * i)) * 1;
      enemyBulletPool.get({
        name: 'enemy-bullet',
        x: x,
        y: y,
        dx,
        dy,
        width: 2,
        height: 2,
        color: 'red',
        ttl: 400,
      });
    }
  });

  on('score', value => {
    shipInstance.score += value;
  });

  on('spawn-boss', (
    sprite,
    shield,
    fireRate,
    path,
    childrenRadius,
    totalChildren,
    spriteChildren,
    fireModeChildren,
    childrenSpeed,
    fireRateChildren,
  ) => {
    canSpawnBoss = false;

    let bossInstance = bossPool.get({
      sprite,
      shield,
      fireRate,
      rotate: false,
      loop: true,
      imune: true,
      debryColor: 'pink',
      childrenSpeed,
      childrenRadius,
      path: createPath(path),
    });

    emit('spawn-enemy', totalChildren, 0, {
      sprite: spriteChildren,
      shield: 2,
      fireRate: fireRateChildren,
      fireMode: fireModeChildren,
      parent: bossInstance,
      path: null,
    });
  });

  on('spawn-enemy', (total, interval, props) => {
    const shieldMultiplier = (virtualLevel + 1) / (currentLevel + 1) > 1 ? Math.floor(((virtualLevel + 1) / (currentLevel + 1)) * props.shield * 0.2) : 0;

    for (let i = 0; i < total; i++) {
      const angle = i * (360 / total);
      delay((angle) => {
        enemyPool.get({
          ...props,
          anglePlacement: degToRad(angle),
          shield: props.shield + shieldMultiplier,
        });
      }, i * interval, angle);
    }
  });

  on('spawn-asteroid', (total, interval, positions, speedsX, speedsY) => {
    const shieldMultiplier = (virtualLevel + 1) / (currentLevel + 1) > 1 ? Math.floor(((virtualLevel + 1) / (currentLevel + 1)) * 10 * 0.2) : 0;
    let vi = 0;
    for (let i = 0; i < total; i++) {
      vi > positions.length - 1 && (vi = 0);

      delay((i, vi) => {
        asteroidPool.get({
          x: positions[vi],
          y: -8,
          dx: speedsX[vi],
          dy: speedsY[vi],
          shield: 10 + shieldMultiplier,
        });
      }, i * interval, i, vi);

      vi++;
    }
  });

  on('spawn-powerup', (type, x, dy) => {
    powerupPool.get({ type, x, y: -8, dy });
  });

  on('set-dialog', (pauseOnTalk, texts) => {
    dialogInstance.start({
      texts,
      pauseOnTalk,
    });
  });

  on('next-level', level => {
    currentLevel = level;
    virtualLevel++;
    frame = 0;
    firstRun = false;
    levelLastFrame = getLevelLastFrame(level);
  });

  on('boss-die', () => {
    emit('score', 200);
    currentLevel++;
    currentLevel >= totalLevels && (currentLevel = 0);
    emit('next-level', currentLevel);
  });

  on('game-over', () => {
    const hiScore = localStorage.getItem('hiScore') || 0;
    shipInstance.score > hiScore && localStorage.setItem('hiScore', shipInstance.score);
    emit('change-scene', 'game-over', { score: shipInstance.score, previous: hiScore });
  });

  const qtShipBullets = quadtree();
  const qtShip = quadtree();
  const qtAsteroids = quadtree();

  return scene({
    children: [
      starPool,
      textScore,
      textLives,
      shipBulletPool,
      enemyBulletPool,
      shipInstance,
      enemyPool,
      bossPool,
      asteroidPool,
      powerupPool,
      explosionPool,
      progressShield,
      dialogInstance,
      levelText,
    ],
    update() {
      this.paused = false;
      if (dialogInstance.isTalking && dialogInstance.pauseOnTalk) {
        dialogInstance.update();
        this.paused = true;
        return;
      }

      if (frame < 40) {
        levelText.text = `LEVEL ${virtualLevel + 1}`;
        levelText.ttl = 100;
      }

      const totalEnemies = enemyPool.size + asteroidPool.size;
      frame === levelLastFrame && (canSpawnBoss = true);
      processLevel(frame, currentLevel, totalEnemies, canSpawnBoss);

      if (shipInstance.lives <= 0) {
        emit('game-over');
        return;
      }

      shipBulletPool.getAliveObjects().forEach(bullet => {
        qtShipBullets.clear();
        qtShipBullets.add(bullet, asteroidPool.getAliveObjects(), enemyPool.getAliveObjects(), bossPool.getAliveObjects());
        checkCollisions(bullet, qtShipBullets.get(bullet));
      });

      qtShip.clear();
      qtShip.add(
        shipInstance,
        asteroidPool.getAliveObjects(),
        enemyPool.getAliveObjects(),
        enemyBulletPool.getAliveObjects(),
        bossPool.getAliveObjects(),
        powerupPool.getAliveObjects(),
      );
      checkCollisions(shipInstance, qtShip.get(shipInstance));

      qtAsteroids.clear();
      qtAsteroids.add(asteroidPool.getAliveObjects());
      asteroidPool.getAliveObjects().forEach(asteroid => {
        checkCollisions(asteroid, qtAsteroids.get(asteroid));
      });

      textScore.text = `SCORE ${shipInstance.score}`;
      textLives.text = `@@@`.slice(0, shipInstance.lives);

      firstRun && frame > 40 && frame < 140 && frame % 20 === 0 && starPool.decreaseVel(2);
      frame++;
    },
  });
}