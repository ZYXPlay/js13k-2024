import { imageAssets } from "./assets";
import { GameObject } from "./game-object";

export class Text extends GameObject {
  constructor(props = {}) {
    const properties = {
      name: 'text',
      x: 0,
      y: 0,
      text: '',
      color: 'white',
      align: 'left',
      lineHeight: 8,
      scale: 1,
      spritesheet: imageAssets['font.png'],
      ...props,
    };
    super(properties);
  }
  draw() {
    const charWidth = 8;
    const charHeight = 8;
    const texts = this.text.split('\n');
    const { context, align, lineHeight, color } = this;

    context.save();
    texts.forEach(t => {
      context.save();

      if (align === 'center') {
        context.translate(-t.length * charWidth / 2, 0);
      }
      if (align === 'right') {
        context.translate(-t.length * charWidth, 0);
      }

      for (let i = 0; i < t.length; i++) {
        const char = t.charCodeAt(i);
        let index = 0;
        char >= 65 && char <= 90 ? index = char - 65 : null;
        char >= 48 && char <= 57 ? index = char - 22 : null;
        char === 32 && (index = -1);
        char === 46 && (index = 36);
        char === 44 && (index = 37);
        char === 63 && (index = 38);
        char === 33 && (index = 39);
        char === 58 && (index = 40);
        char === 64 && (index = 41);

        if (index === -1) {
          continue;
        }

        const sx = index * charWidth,
          sy = 0,
          sw = charWidth,
          sh = charHeight,
          dx = i * charWidth,
          dy = 0,
          dw = charWidth,
          dh = charHeight;

        context.drawImage(this.spritesheet, sx, sy, sw, sh, dx, dy, dw, dh);
        context.globalCompositeOperation = "source-atop";
        context.fillStyle = color || "white";
        context.fillRect(dx, 0, charWidth, charHeight);
        context.globalCompositeOperation = "source-over";
      }

      context.restore();
      context.translate(0, lineHeight);
    });
    context.restore();
  }
}

export function text (props) { return new Text(props)};