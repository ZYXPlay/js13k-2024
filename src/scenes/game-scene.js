import { emit, on } from "../engine/events";
import { gameObject } from "../engine/game-object";
import { scene } from "../engine/scene";
import { text } from "../engine/text";
import { explosionParticle } from "../entities/explosion-particle";
import { ship } from "../entities/ship";
import { pool } from "../engine/pool";
import starfield from "../entities/starfield";
import { zzfxP } from "../engine/zzfx";
import { asteroid } from "../entities/asteroid";
import { quadtree } from "../engine/quad-tree";
import { clamp, createPath, degToRad, delay, rnd } from "../engine/utils";
import { enemy } from "../entities/enemy";
import { boss } from "../entities/boss";
import { dialog } from "../entities/dialog";
import { checkCollisions } from "./game-collisions";
import { offKey, onKey } from "../engine/keyboard";
import { powerup } from "../entities/powerup";
import { getLevelLastFrame, processLevel, totalLevels } from "../levels";
import { player } from "../engine/globals";
import { dataAssets } from "../engine/assets";

export default function gameScene() {
  onKey(['esc'], () => {
    emit('change-scene', 'menu');
  });
  onKey(['p'], () => {
    emit('pause');
  });
  onKey(['m'], () => {
    if (player.playing) {
      player.stop();
    } else {
      player.start();
    }
  });
  offKey(['enter']);
  onKey(['enter'], () => dialogInstance.skip());

  player.set('song1');
  player.start();

  const shipInstance = ship({ x: 120, y: 248 });
  const starPool = starfield(20);
  const dialogInstance = dialog();
  const blockingDialogInstance = dialog();
  let currentLevel = 0, virtualLevel = 0;
  let levelMultiplier = virtualLevel > 3 ? Math.floor(virtualLevel * 0.5) : 0;
  let frame = 0;
  let firstRun = true;
  let canSpawnBoss = false;
  let levelLastFrame = getLevelLastFrame(currentLevel);
  let noShieldPowerups = false;

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

  const visionEffect = gameObject({
    x: 0, y: 0, active: false, radius: 384,
    update() { },
    draw() {
      const { context: ctx } = this;
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.arc(shipInstance.x, shipInstance.y, this.radius, 0, Math.PI * 2, true);
      ctx.clip();
      ctx.stroke();
    },
    start() {
      zzfxP(dataAssets['transition']);
      this.radius = 384;
      this.active = true;
    },
    end() {
      zzfxP(dataAssets['transition']);
      this.active = false;
    },
    update() {
      this.active && this.radius > 60 && (this.radius -= 2);
      !this.active && this.radius < 384 && (this.radius += 1);
      this.advance();
    },
    render() {
      this.draw();
    }
  });

  const visionEffectEnd = gameObject({
    x: 0, y: 0,
    update() { },
    draw() {
      const { context: ctx } = this;
      ctx.restore();
    },
    render() {
      this.draw();
    }
  });

  on('hit', () => {
    zzfxP(dataAssets['hit']);
  });

  on('explosion', (x, y, volume, magnitude, color) => {
    zzfxP(dataAssets['explosion']);

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
    zzfxP(dataAssets['shoot']);
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

  on('ship-die', () => {
    emit('spawn-powerup', 'fire', 128, .6);
  });

  on('enemy-fire', (x, y) => {
    zzfxP(dataAssets['shoot']);
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
      ttl: 300,
    });
  });

  on('boss-fire', (x, y) => {
    zzfxP(dataAssets['shoot2']);

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
    shipInstance.score += Math.floor(value + (levelMultiplier * 2));
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
    total = total + levelMultiplier;
    for (let i = 0; i < total; i++) {
      const angle = i * (360 / total);
      const speed = clamp(1, 2, props.sprite / 4);
      delay((angle) => {
        enemyPool.get({
          ...props,
          speed,
          anglePlacement: degToRad(angle),
          shield: props.shield + levelMultiplier,
        });
      }, i * interval, angle);
    }
  });

  on('spawn-asteroid', (total, interval, positions, speedsX, speedsY) => {
    if (total === 13) {
      visionEffect.start();
      delay(() => visionEffect.end(), 15000);
    }

    let vi = 0;
    for (let i = 0; i < total; i++) {
      vi > positions.length - 1 && (vi = 0);

      delay((i, vi) => {
        asteroidPool.get({
          x: positions[vi],
          y: -8,
          dx: speedsX[vi],
          dy: speedsY[vi],
          shield: 10 + levelMultiplier,
        });
      }, i * interval, i, vi);

      vi++;
    }
  });

  on('spawn-powerup', (type, x, dy) => {
    if (type === 'shield' && noShieldPowerups) return;
    powerupPool.get({ type, x, y: -8, dy });
  });

  on('set-dialog', (pauseOnTalk, texts) => {
    if (pauseOnTalk) {
      blockingDialogInstance.start({
        texts,
        pauseOnTalk: true,
      });  
    } else {
      dialogInstance.start({
        texts,
        pauseOnTalk: false,
      });  
    }
  });

  on('next-level', level => {
    canSpawnBoss = false;
    currentLevel = level;
    virtualLevel++;
    frame = 0;
    firstRun = false;
    levelLastFrame = getLevelLastFrame(level);
    levelMultiplier = virtualLevel > 3 ? Math.floor(virtualLevel * 0.25) : 0;
    emit('score', 100);
    if (virtualLevel === 12) emit('level-13');
    if (virtualLevel === 25) emit('level-26');
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

  on('level-13', () => {
    emit('set-dialog', true, [
      'LETS MAKE THIS',
      'INSTERESTING.',
      'NOW WITH ONE LIFE ONLY',
    ]);
    shipInstance.lives = 1;
    shipInstance.shield = 100;
  });

  on('level-26', () => {
    emit('set-dialog', true, [
      'HEY! YOU ARE GOOD AT THIS!',
      'NOW ONE HIT AND YOU DIE!',
      'AND NO SHIELD POWERUPS.'
    ]);
    shipInstance.lives = 1;
    shipInstance.shield = 10;
    noShieldPowerups = true;
  });


  const qtShipBullets = quadtree();
  const qtShip = quadtree();
  const qtAsteroids = quadtree();

  return scene({
    children: [
      visionEffect,
      starPool,
      shipBulletPool,
      enemyBulletPool,
      shipInstance,
      enemyPool,
      bossPool,
      asteroidPool,
      powerupPool,
      explosionPool,
      visionEffectEnd,
      dialogInstance,
      blockingDialogInstance,
      progressShield,
      levelText,
      textScore,
      textLives,
    ],
    gameOver: false,
    update() {
      this.paused = false;
      if (blockingDialogInstance.isTalking && blockingDialogInstance.pauseOnTalk) {
        blockingDialogInstance.update();
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

      if (shipInstance.lives <= 0 && !this.gameOver) {
        this.gameOver = true;
        delay(() => emit('game-over'), 1000);
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