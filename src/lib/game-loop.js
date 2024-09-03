import { getContext } from "./utils";

export default function gameLoop({
  update,
  render,
}) {
  let fps = 60;
  let accumulator = 0;
  let delta = 1e3 / fps; // delta between performance.now timings (in ms)
  let step = 1 / fps;
  let last, rAF, now, dt, loop;
  const ctx = getContext();

  function frame() {
    rAF = requestAnimationFrame(frame);
    now = performance.now();
    dt = now - last;
    last = now;

    if (dt > 1e3) {
      return;
    }

    accumulator += dt;

    while (accumulator >= delta) {
      update(step);
      accumulator -= delta;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    render();
  }

  loop = {
    start() {
      last = performance.now();
      requestAnimationFrame(frame);
    }
  }

  return loop;
}