import { imageGeneration } from "../engine/image-generation";

export default async (color = 'white') => {
  const img = new Image();
  img.src = `font.png`;
  const colors = {
    white: ['rgb(255, 255, 255)', 'rgb(255, 255, 255)', 'rgb(63, 63, 63)'],
    yellow: ['rgb(255, 255, 255)', 'rgb(255, 255, 127)', 'rgb(255, 255, 127)', 'rgb(127, 127, 63)'],
    red: ['rgb(255, 0, 0)', 'rgb(255, 0, 0)', 'rgb(63, 0, 0)'],
    green: ['rgb(0, 127, 0)', 'rgb(0, 127, 0)', 'rgb(0, 63, 0)'],
    lightgreen: ['rgb(0, 255, 63)', 'rgb(0, 255, 63)', 'rgb(0, 63, 31)'],
    gray: ['rgb(127, 127, 127)', 'rgb(127, 127, 127)', 'rgb(63, 63, 63)'],
    lightblue: ['rgb(0, 254, 254)', 'rgb(0, 127, 127)', 'rgb(0, 63, 63)'],
  };

  return new Promise((resolve) => {
    img.onload = () => {
      resolve(imageGeneration({
        async draw(ctx) {
          ctx.drawImage(img, 0, 0);
          ctx.save();
          ctx.globalCompositeOperation = 'source-in';

          const gradient = ctx.createLinearGradient(0, 0, 0, 8);
          gradient.addColorStop(0, colors[color][0]);
          gradient.addColorStop(0.5, colors[color][1]);
          gradient.addColorStop(1, colors[color][2]);
        
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 378, 9);
          const imgData = ctx.getImageData(0, 0, 378, 9);
          const bmp = await createImageBitmap(imgData);
          ctx.globalCompositeOperation = 'source-over';
          ctx.clearRect(0, 0, 378, 9);
          for (let j = -1; j < 2; j++) {
            for (let k = -1; k < 2; k++) {
              ctx.drawImage(img, j, k);
            }
          }
          ctx.drawImage(bmp, 0, 0);
        },
      }));
    };
  });
};