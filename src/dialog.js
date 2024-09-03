import { imageAssets } from "./lib/assets";
import gameObject from "./lib/game-object";
import text from "./lib/text";

export default function createDialog ({x = 8, y = 8}) {
  return gameObject({
    name: 'dialog',
    x: 8,
    y: 248,
    image: imageAssets['spritesheet.png'],
    sprites: [10, 11, 12, 13, 14],
    text: text({text: '', x: 16, y: 8, align: 'left'}),
    textIndex: 0,
    texts: [],
    textsIndex: 0,
    spriteIndex: 0,
    frame: 0,
    anchor: { x: 0, y: 0 },
    talking: false,
    isTalking: false,
    start(dialog) {
      setTimeout(() => {
        this.isTalking = true;
        this.texts = dialog.texts;
        this.frame = 0;
      }, 1000);
      this.dy = -2;
    },
    stop() {
      this.text.text = '        ';
      this.isTalking = false;
      setTimeout(() => {
        this.texts = [];
        this.textsIndex = 0;
        this.textIndex = 0;
        this.frame = 0;
      }, 1000);
      this.dy = 2;
    },
    update() {
      this.y < 224 && (this.dy = 0);
      this.y > 248 && (this.dy = 0);
      if (this.texts.length === 0) return;
      this.talking = false;
      const t = this.texts[this.textsIndex] + '      ';
      t[this.textIndex] !== ' ' && (this.talking = true);
      this.frame % 5 == 0 && (this.textIndex++);
      this.text.text = t.slice(0, this.textIndex);
      this.frame++;
      this.textIndex >= t.length && (this.textsIndex++, this.frame = 0, this.textIndex = 0);
      this.textsIndex >= this.texts.length && (this.stop());
      this.talking && (this.frame % 5 == 0 && this.spriteIndex++);
      this.spriteIndex >= this.sprites.length && (this.spriteIndex = 0);
      this._update();
    },
    draw() {
      const { context: ctx, image } = this;
      ctx.fillStyle = 'white';
      ctx.fillRect(-2, -2, 12, 12);
      ctx.drawImage(image, this.sprites[this.spriteIndex] * 8, 0, 8, 8, 0, 0, 8, 8);
      ctx.translate(16, 0);
      this.text.draw();
    },
  });
}