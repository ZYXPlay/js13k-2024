import { dataAssets } from "../engine/assets";
import { GameObject } from "../engine/game-object";
import { text } from "../engine/text";
import { zzfxP } from "../engine/zzfx";

export class Dialog extends GameObject {
  init(props) {
    const properties = {
      name: 'dialog',
      x: -16,
      y: 200,
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
      stopping: false,
      pauseOnTalk: true,
      ...props,
    };
    super.init(properties);
  }
  skip() {
    if (this.texts.length == 0 || this.textsIndex > this.texts.length) return;
    this.textIndex = this.texts[this.textsIndex].length;
  }
  start(dialog) {
    this.stopping = false;
    setTimeout(() => {
      this.isTalking = true;
      this.texts = ['', ...dialog.texts];
      this.frame = 0;
      this.pauseOnTalk = dialog.pauseOnTalk;
    }, 1000);
    this.dx = 2;
  }
  stop() {
    this.stopping = true;
    this.text.text = '        ';
    this.isTalking = false;
    setTimeout(() => {
      this.texts = [];
      this.textsIndex = 0;
      this.textIndex = 0;
      this.frame = 0;
    }, 1000);
    this.dx = -2;
  }
  update() {
    this.x > 8 && (this.dx = 0, this.x = 8);
    this.y < -16 && (this.dx = 0, this.x = -16);
    if (this.texts.length == 0) return;
    this.talking = false;
    let t = this.texts[this.textsIndex] + '      ';
    t[this.textIndex] !== ' ' && (this.talking = true);
    this.frame % 5 == 0 && (this.textIndex++, t[this.textIndex] !== ' ' && zzfxP(dataAssets['typing']));
    this.textsIndex < this.texts.length && (this.text.text = t.slice(0, this.textIndex));
    this.frame++;
    if (this.textIndex >= t.length) {      
      this.textsIndex++;
      this.frame = 0;
      this.textIndex = 0;
    };
    this.textsIndex >= this.texts.length && (!this.stopping && this.stop());
    this.talking && (this.frame % 5 == 0 && this.spriteIndex++);
    this.spriteIndex >= this.sprites.length && (this.spriteIndex = 0);
    super.update();
  }
  draw() {
    const { context: ctx, spritesheet } = this;
    ctx.fillStyle = 'white';
    ctx.fillRect(-2, -2, 12, 12);
    ctx.drawImage(spritesheet[0], this.sprites[this.spriteIndex] * 8, 0, 8, 8, 0, 0, 8, 8);
    ctx.translate(16, 0);
    this.text.draw();
  }
}

export const dialog = (props) => new Dialog(props);
