export function getContext() {
  return window.zyxplay.context;
}

export function setContext(context) {
  window.zyxplay = window.zyxplay || {};
  window.zyxplay.context = context;
  return context;
}

export function createPath(path) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  // svg.setAttribute('width', '256');
  // svg.setAttribute('height', '240');
  // svg.setAttribute('viewBox', '0 0 128 120');
  const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  svg.appendChild(pathEl);
  pathEl.setAttribute('d', path);
  pathEl.setAttribute('fill', 'none');
  pathEl.setAttribute('stroke', 'black');
  pathEl.setAttribute('stroke-width', '2');
  pathEl.setAttribute('id', 'path');

  return pathEl;
}

export function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

export function angleToTarget(source, target) {
  return Math.atan2(target.y - source.y, target.x - source.x);
}

export function clamp(min, max, value) {
  return Math.min(Math.max(min, value), max);
}

export function collides(obj1, obj2) {
  let rect1 = getRect(obj1);
  let rect2 = getRect(obj2);

  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

export function getRect(obj) {
  let { x = 0, y = 0, width, height } = obj;

  x -= width * .5;
  y -= height * .5;

  if (width < 0) {
    x += width;
    width *= -1;
  }
  if (height < 0) {
    y += height;
    height *= -1;
  }

  return {
    x,
    y,
    width,
    height
  };
}
