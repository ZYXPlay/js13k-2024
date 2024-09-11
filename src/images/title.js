import { imageGeneration } from "../engine/image-generation";

export default () => imageGeneration({
  draw(ctx) {
    // const path = new Path2D('m87 35-4-8v14h-7V18l-3-6h10l6 12 5-12h8v29h-8V27l-4 8h-3Zm18-23h8v29h-8V12Zm11 15 1-9 4-5 6-1a30 30 0 0 1 7 1v10h-5l-1-5-2 1-1 1-1 2v5l1 5 2 2 3 1h4v6h-6c-4 0-8-1-10-3l-2-11Zm30-15 6 1 4 3 1 6-1 5-3 3 5 11h-9l-3-9h-1v9h-8V18l-2-6h11Zm-1 14 2-1 1-3v-3l-1-1h-2v8Zm24 15-6-1c-2-1-3-2-3-4l-2-9 2-9c0-2 1-4 3-5l6-1 7 1 3 5 1 9-1 9-3 4-7 1Zm3-14v-6l-1-2-2-1-1 1-1 2a51 51 0 0 0 0 11l1 2 1 1 2-1 1-2v-5ZM59 68h2l1-1v-1l-1-1-5-2-3-3-2-5c0-3 1-5 3-7l7-2a36 36 0 0 1 7 0l1 1-1 6h-1a36 36 0 0 0-5 0h-2l-1 2 1 1 1 1 4 1 4 3 1 5-2 7c-2 2-4 2-8 2a32 32 0 0 1-9-1l1-6a7202 7202 0 0 0 7 0Zm14 7V46h8v11h4V46h7v29h-7V64h-4v11h-8Zm33 0-6-1-4-4-1-9 1-9 4-5 6-1 6 1 4 5 1 9-1 9-4 4-6 1Zm3-14-1-6v-2l-2-1-2 1v2a51 51 0 0 0 0 11v2l2 1 2-1v-2l1-5Zm20 14-6-1c-1-1-3-2-3-4l-1-9 1-9c0-2 2-4 3-5l6-1 7 1c1 1 3 3 3 5l1 9-1 9c0 2-2 3-3 4l-7 1Zm3-14v-6l-1-2-2-1-1 1-1 2a51 51 0 0 0 0 11l1 2 1 1 2-1 1-2v-5Zm28-8h-5v22h-8V53h-6v-7h20l-1 7Zm2-7h19l-2 7h-7v4h7l-1 6h-6v6h9l-1 6h-16V52l-2-6Zm31 0 6 1 3 3 2 6-1 5-3 3 5 11h-9l-3-9h-1v9h-8V52l-2-6h11Zm-1 14 2-1 1-3v-3l-1-1h-2v8Z');
    // const path = new Path2D('M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z');
    const path = new Path2D('m71 24-1 15H60l2-30h13l3 15h1l3-15h13l2 30H87l-1-15-4 15h-7l-4-15Zm39 15h-10V9h10v30Zm25-9v8l-7 2-7-1-5-3-2-5-1-7 1-7 2-5 4-3a21 21 0 0 1 9-1 29 29 0 0 1 6 2l-1 7-6-1-3 1-1 2v12a22 22 0 0 0 3 1l8-2Zm25-1 5 10h-11l-4-9h-2v9h-9V9h15c7 0 10 4 10 11 0 4-1 7-4 9Zm-10-12h-2v6h2l3-1 1-1v-2l-1-2h-3Zm17 7v-7l3-5 4-3 7-1 7 1 4 3 2 5 1 7-1 7-2 5-4 3-7 1-7-1-4-3-3-5v-7Zm10-5v13h4l3-1 1-2V16h-4l-3 1-1 2ZM30 72l1-7a34 34 0 0 0 13 0v-2h-4l-5-1-3-2-2-3v-4l1-5a7 7 0 0 1 5-5l6-1 11 1-1 8a48 48 0 0 0-12 0v2h4l5 1 3 2 2 3 1 4-1 5-2 3-2 2h-3l-3 1a53 53 0 0 1-14-2Zm55 1H75V62h-7v11H58V43h10v11h7V43h10v30Zm3-15 1-7 2-5 5-3 6-1 7 1 4 3c2 1 2 3 3 5l1 7-1 7-2 5-5 3-7 1-7-1-4-3-2-5-1-7Zm11-5v13h4l2-1 1-2V50h-4l-3 1v2Zm19 5 1-7 2-5 5-3 7-1 6 1 5 3 2 5 1 7-1 7-2 5-5 3-6 1-7-1-5-3-2-5-1-7Zm11-5v13h4l3-1V50h-4l-2 1-1 2Zm42-10v8h-6v22h-10V51h-7v-8h23Zm22 12v7h-9v3h11v8h-21V43h21l-1 8h-10v4h9Zm27 8 6 10h-11l-4-9h-2v9h-9V43h15c7 0 10 4 10 11 0 4-2 7-5 9Zm-9-12h-2v6h2l3-1 1-1v-2l-1-2h-3Z');
    ctx.fillStyle = 'white';
    ctx.fill(path);
    ctx.globalCompositeOperation = 'source-in';

    const gradient = ctx.createLinearGradient(0, 20, 0, 80);
    gradient.addColorStop(0, 'rgb(255, 255, 255, 1)');
    gradient.addColorStop(0.21, 'rgb(0, 255, 255, 1)');
    gradient.addColorStop(1, 'rgb(0, 0, 255, 1)');
  
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 240);
  
    ctx.globalCompositeOperation = 'source-over';

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.stroke(path);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke(path);
  },
});