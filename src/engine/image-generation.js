import dither from './dither';

export class ImageGeneration {
  constructor(props) {
    this.canvas = document.createElement('canvas');
    // this.canvas = document.getElementById('c2');
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.ctx.imageSmoothingEnabled = false;
    this.image = new Image();
    Object.assign(this, props);
  }

  async generate(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;

    this.draw && await this.draw(this.ctx);

    const data = this.ctx.getImageData(0, 0, width, height);
    const dithered = new ImageData(
      dither.dither(data, width, height),
      width,
      height,
    );
    this.ctx.putImageData(dithered, 0, 0);
    this.image.src = this.canvas.toDataURL();

    return new Promise((resolve) => {
      this.image.onload = () => resolve(this.image);
    });
    // return this.canvas.toDataURL();
  }
}

export function imageGeneration(props) {
  return new ImageGeneration(props);
}