import createEnemy from "./enemy";
import { getLevel, totalLevels } from "./levels";
import { emit, on } from "./lib/events";
import gameObject from "./lib/game-object";
import pool from "./lib/pool";
import scene from "./lib/scene";
import { collides, degToRad } from "./lib/utils";
import createShip from "./ship";
import text from "./lib/text";
import Quadtree from "./lib/QuadTree";
import starfield from "./starfield";
import { zzfx } from "./lib/zzfx";
import { onKey } from "./lib/keyboard";
import { imageAssets } from "./lib/assets";

export default function gameScene() {
  onKey(['esc'], () => {
    emit('change-scene', 'menu');
  });

  function processPowerups(powerups, frame) {
    const types = [
      ['powerup-fire', 'green', 5],
      ['powerup-shield', 'yellow', 18],
    ];
    powerups.forEach(powerup => {
      if (powerup.frame !== undefined && frame === powerup.frame) {
        const type = types[powerup.type];
        powerupPool.get({
          name: type[0],
          x: powerup.x,
          y: -8,
          width: 8,
          height: 8,
          color: type[1],
          dy: powerup.speed,
          image: imageAssets['font.png'],
          value: powerup.value,
          ttl: 300,
          die() {
            ship.score += this.value;
            powerup.type === 0 && zzfx(...[1.6,,291,.01,.21,.35,,2.2,,,-136,.09,.03,,,.2,.2,.7,.28]); // Powerup 47
            powerup.type === 1 && zzfx(...[.5,,375,.03,.07,.08,1,2.7,,,302,.05,.05,,,,,.93,.01,,607]); // Pickup 61
            this.ttl = 0;
          },
          draw() {
            const { context: ctx } = this;
            if(this.frame % 20 < 10) {
              ctx.fillStyle = this.color;
              ctx.fillRect(-3, -3, this.width + 6, this.height + 6);  
              ctx.fillStyle = 'black';
              ctx.fillRect(-2, -2, this.width + 4, this.height + 4);  
            }
            ctx.fillStyle = this.color;
            ctx.fillRect(-1, -1, this.width + 2, this.height + 2);
            ctx.drawImage(this.image, 8 * type[2], 0, 8, 8, 0, 0, 8, 8);
          },
        });
      }
    });
  };

  function processLevel(level, frame) {
    level.waves.forEach(wave => {
      const waveFrame = frame - wave.frame;
      const totalFrames = wave.frame + (wave.total * wave.interval);
      if (frame >= wave.frame && frame < totalFrames && wave.count < wave.total && waveFrame % wave.interval === 0) {
        wave.completed = false;
        wave.count += 1;
        enemyPool.get({
          x: -100,
          y: -100,
          path: wave.path,
          rotate: wave.rotate,
          loop: wave.loop,
          ttl: Infinity,
          imune: true,
          dying: false,
          shield: ([5, 6].includes(wave.sprite) ? 4 : 2) * Math.floor(virtualLevel / 4),
          frame: 0,
          sprite: wave.sprite,
          wave,
        });
      }

      processPowerups(wave.powerups, frame);

      if (!wave.completed && wave.count === wave.total && wave.killed === wave.total) {
        wave.completed = true;
      }
    });
  }

  function checkCollisions(source, targets) {
    if (!source.isAlive() || source.imune) return;
    targets.forEach(target => {
      if (source.name === 'enemy' && target.name === 'enemy') return;

      if (target.isAlive() && !source.imune && !target.imune && collides(target, source)) {

        !target.name.includes('powerup-') && target.die();

        if (source.name == 'ship' && target.name == 'enemy') {
          source.hit(50);
        } else if (source.name == 'ship' && target.name == 'powerup-fire') {
          source.firePowerup(target.value);
          target.die();
        } else if (source.name == 'ship' && target.name == 'powerup-shield') {
          source.shieldPowerup(target.value);
          target.die();
        } else if (source.name == 'ship') {
          source.hit(10);
        }

        source.name == 'enemy' && (source.hit(1), ship.score += 10);
      }
    });
  }

  let
    virtualLevel = 1,
    currentLevel = 1;

  const ship = createShip();
  const starField = starfield();

  const bulletPool = pool({
    create: gameObject,
    maxSize: 100,
  });

  const enemyBulletPool = pool({
    create: gameObject,
    maxSize: 100,
  });

  const enemyPool = pool({
    create: createEnemy,
    maxSize: 100,
  });

  const explosionPool = pool({
    create: gameObject,
    maxSize: 300,
  });

  const powerupPool = pool({
    create: gameObject,
    maxSize: 10,
  });

  const textScore = text({
    x: 8,
    y: 8,
    text: 'SCORE 0',
  });

  const textLives = text({
    x: 256 - 8 - 8 * 3,
    y: 8,
    text: '@@@',
    color: 'red',
  });

  const textFrames = text({
    x: 8,
    y: 240 - 16,
    text: '',
    color: 'yellow',
  });

  const levelText = text({
    x: 128,
    y: 120,
    text: `LEVEL ${virtualLevel}`,
    color: 'lightgreen',
    align: 'center',
  });

  const progressShield = gameObject({
    x: 256 - 8 * 8,
    y: 8,
    width: 24,
    height: 8,
    anchor: { x: 0, y: 0 },
    draw() {
      const { context: ctx } = this;
      const value = ship.shield >= 0 ? ship.shield / 5: 0; // ship.shield >= 0 ? 24 * ship.shield / 100 : 0;
      ctx.strokeStyle = 'white';
      ctx.strokeRect(0, 0, this.width, this.height);

      ctx.fillStyle = 'green';
      ship.shield < 25 && (ctx.fillStyle = 'red');
      ctx.fillRect(2, 2, value, this.height-4);
    }
  });

  // Events
  on('ship-fire', (x, spread = 0) => {
    bulletPool.get({
      name: 'ship-bullet',
      x,
      y: ship.y - 4,
      dx: (1 - Math.random() * 2) / (4 - spread),
      dy: -5,
      width: 2,
      height: 3,
      ttl: 80,
      die() {
        this.ttl = 0;
        this.x = -100;
        this.y = -100;
      },
      draw() {
        const { context: ctx } = this;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.width, 1);
        ctx.fillStyle = 'yellow';
        ctx.fillRect(0, 1, this.width, 1);
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 2, this.width, 1);
      },
    });
    zzfx(...[.9,,413,,.05,.01,1,3.8,-3,-13.4,,,,,,,.11,.65,.07,,237]); // Shoot 124
  });

  on('enemy-fire', ({ x, y }, mode = 0) => {
    const vx = ship.x - 4 - x;
    const vy = ship.y - y;
    const dist = Math.hypot(vx, vy) / 1;
    enemyBulletPool.get({
      name: 'enemy-bullet',
      x: x + 4,
      y,
      dx: mode == 0 ? 0 : vx / dist,
      dy: mode == 0 ? 1.5 : vy / dist,
      width: 2,
      height: 2,
      ttl: 400,
      die() {
        this.ttl = 0;
        this.x = -100;
        this.y = -100;
      },
      draw() {
        const { context: ctx } = this;
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, this.width, this.width);
      },
    });
    zzfx(...[.3,,222,.02,.04,.09,3,.3,11,10,,,,,15,,,.53,.17]); // Shoot 141
  });

  on('explosion', (x, y, volume = 50, magnitude = 3, color = 'white') => {
    for (let i = 0; i < volume; i++) {
      let angle = Math.random() * 360;
      let maxMagnitude = magnitude;
      let newMagnitude = Math.random() * maxMagnitude + maxMagnitude;
    
      explosionPool.get({
        name: 'particle',
        x,
        y,
        dx: Math.cos(degToRad(angle)) * newMagnitude / 10,
        dy: Math.sin(degToRad(angle)) * newMagnitude / 10,
        width: 1,
        height: 1,
        ttl: 30 * maxMagnitude,
        color,
        update() {
          const col = 256 / 30 * maxMagnitude * (this.ttl / 30);
          color == 'white' && (this.color = `rgb(${col},${col},${col})`);
          color == 'red' && (this.color = `rgb(${col},0,0)`);
          this._update();
        },
        draw() {
          const { context: ctx } = this;
          ctx.fillStyle = this.color;
          ctx.fillRect(0, 0, this.width, this.height);
        }
      });

      explosionPool.get({
        name: 'particle',
        x,
        y,
        dx: Math.cos(degToRad(angle)) * newMagnitude / 20,
        dy: Math.sin(degToRad(angle)) * newMagnitude / 20,
        width: 2,
        height: 2,
        ttl: 10 * maxMagnitude / 2,
        update() {
          const col = 256 / (maxMagnitude / 2) * (this.ttl / 10);
          this.color = `rgb(${col},${col},${col})`;
          this._update();
        },
        draw() {
          const { context: ctx } = this;
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(0, 0, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

    }
    zzfx(...[,,45,.03,.21,.6,4,.9,2,-3,,,,.2,,.9,,.45,.26]); // Explosion 39
  });

  on('game-over', () => {
    setTimeout(() => emit('change-scene', 'game-over', {score: ship.score}), 2000);
  });

  const qtShip = new Quadtree();
  const qtEnemies = new Quadtree();

  return scene({
    objects: [starField, ship, powerupPool, bulletPool, enemyBulletPool, enemyPool, explosionPool, textScore, textLives, progressShield, textFrames],
    level: getLevel(currentLevel, 1) ,//levels[0],
    frame: 0,
    update() {
      processLevel(this.level, this.frame);
      levelText.update();

      qtShip.clear();
      qtShip.add(ship, enemyPool.getAliveObjects(), enemyBulletPool.getAliveObjects(),powerupPool.getAliveObjects());
      checkCollisions(ship, qtShip.get(ship));

      qtEnemies.clear();
      enemyPool.getAliveObjects().forEach(enemy => {
        qtEnemies.add(enemy, bulletPool.getAliveObjects());
        checkCollisions(enemy, qtEnemies.get(enemy));
      });

      const wavesLeft = this.level.waves.filter(wave => !wave.completed).length;
      if (wavesLeft === 0 && enemyPool.getAliveObjects().length === 0) {
        virtualLevel++;
        currentLevel++;
        currentLevel > totalLevels && (currentLevel = 1);
        this.level = getLevel(currentLevel, virtualLevel);
        this.frame = 0;
        levelText.text = `LEVEL ${virtualLevel}`;
        zzfx(...[,,264,.07,.29,.06,1,3.7,,-30,-148,.07,.08,,,,,.76,.22,,-1240]); // Powerup 152
      }

      textScore.text = `SCORE ${ship.score}`;
      textLives.text = `@@@`.slice(0, ship.lives);
      textFrames.text = `${(this.frame + '').padStart(8, '0')} ${(wavesLeft + '').padStart(2, '0')}`;

      this.frame++;
    },
    render() {
      this.frame < 100 && levelText.render();
    },
  });
}