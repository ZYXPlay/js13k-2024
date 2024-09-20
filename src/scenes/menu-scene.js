import { scene } from "../engine/scene";
import starfield from "../entities/starfield";
import { onKey, offKey } from "../engine/keyboard";
import { emit } from "../engine/events";
import { clamp, delay, rnd } from "../engine/utils";
import { text } from "../engine/text";
import { gameObject } from "../engine/game-object";
import { dataAssets, imageAssets } from "../engine/assets";
import { zzfxP } from "../engine/zzfx";

export default function menuScene() {
  onKey(['enter'], () => {
    emit('change-scene', 'game');
  });
  offKey(['esc']);
  const starPool = starfield(90);

  const title = gameObject({
    x: 128,
    y: 48,
    anchor: { x: 0.5, y: 0.5 },
    width: 256,
    height: 100,
    scaleX: 0.01,
    scaleY: 0.01,
    image: imageAssets['title.png'],
    update() {
      // this.scaleX = this.scaleY = 0.95 + Math.sin(this.frame / 10) * 0.05;
      this.scaleX = this.scaleY = clamp(0, 1, this.frame / 200);
      this.advance();
    },
    draw() {
      if (this.frame < 2) return;
      const { context: ctx } = this;
      ctx.drawImage(this.image, 0, 0);
    },
  });

  const shineEffect = gameObject({
    x: 0,
    y: 72,
    anchor: { x: 0.5, y: 0.5 },
    width: 30,
    height: 200,
    ttl: Infinity,
    dx: 5,
    limit: 1000 * rnd(1, 2),
    update() {
      this.x > this.limit && (this.x = 0, this.limit = 1000 * rnd(1, 2));
      this.advance();
    },
    draw() {
      const { context: ctx } = this;
      ctx.save();
      ctx.globalCompositeOperation = 'source-atop';
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = 'white';
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-10, 0, 5, this.height);
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillRect(40, 0, 10, this.height);
      ctx.restore();
    },
  });

  const randomShip = gameObject({
    x: 128,
    y: 256,
    anchor: { x: 0.5, y: 0.5 },
    width: 8,
    height: 8,
    image: imageAssets['spritesheet.png'],
    sprite: 4,
    dy: -0.5,
    spawn() {
      this.x = rnd(0, 256);
      this.y = 256;
      this.dy = -rnd(0.5, 1.5);
      this.sprite = Math.floor(rnd(3, 9));
    },
    update() {
      this.y < -8 && (this.y = -8, delay(() => this.spawn(), rnd(1000, 2000)));
      this.advance();
    },
    draw() {
      const { context: ctx } = this;
      ctx.save();
      ctx.drawImage(this.image, this.sprite * 8, 0, 8, 8, 0, 0, 8, 8);
      ctx.restore();
    },
  });

  const saturn = gameObject({
    x: 128 + 96,
    y: 256 + 120,
    anchor: { x: 0.5, y: 0.5 },
    width: 256,
    height: 240,
    image: imageAssets['saturn.png'],
    dy: -0.7,
    update() {
      this.y < 240 && (this.dy = 0);
      this.advance();
    },
    draw() {
      const { context: ctx } = this;
      ctx.save();
      // ctx.globalAlpha = 0.5;
      ctx.drawImage(this.image, 0, 0, 256, 240);
      ctx.restore();
    },
  });

  const titleText = text({
    x: 128,
    y: 24,
    text: 'BLIND FEAR',
    align: 'center',
    color: 'red',
    scaleX: 2,
    scaleY: 4,
  });

  const editionText = text({
    x: 128,
    y: 128,
    text: 'DIRECTORS CUT EDITION',
    align: 'center',
    color: 'yellow',
  });

  const hiscoreText = text({
    x: 128,
    y: 128 + 24,
    text: 'HI SCORE: 0',
    align: 'center',
    color: 'green',
  });

  const gameByText = text({
    x: 128,
    y: 128,
    text: 'A GAME BY\nMARCO FERNANDES',
    lineHeight: 16,
    color: 'white',
    align: 'center',
  });

  const controlsText = text({
    x: 128,
    y: 128 + 48,
    text: 'ARROWS OR WASD TO MOVE\nSPACE TO SHOOT',
    lineHeight: 16,
    align: 'center',
  });

  const startText = text({
    x: 128,
    y: 240 - 16,
    text: 'ENTER TO START',
    color: 'lightgreen',
    align: 'center',
  });

  hiscoreText.text = `HIGH SCORE: ${localStorage.getItem('hiscore') || 0}`;

  const s = scene({
    frame: 0,
    children: [
      starPool,
      saturn,
      randomShip,
      startText,
    ],
    update() {
      this.frame > 40 && this.frame < 180 && this.frame % 20 === 0 && starPool.decreaseVel(2);
      this.frame++;
    }
  });

  delay(() => {
    s.add(title);
    s.add(shineEffect);
    zzfxP(dataAssets['engineSlowdown']);
  }, 500);

  // delay(() => {
  //   s.add(saturn);
  // }, 600);

  delay(() => {
    s.add(editionText);
  }, 2000);

  delay(() => {
    s.add(hiscoreText);
  }, 2500);

  // delay(() => {
  //   s.add(gameByText);
  // }, 3000);

  delay(() => {
    s.add(controlsText);
  }, 3000);

  return s;
}
