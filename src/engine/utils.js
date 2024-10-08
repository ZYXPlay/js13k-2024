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

export function delay(callback, ms, ...args) {
  return setTimeout(callback, ms, ...args);
}

export function rnd(min = 0, max = 1) {
  return (Math.random())*(max-min)+min;
}

/*
  (c) 2012-2021 Noora Halme et al. (see AUTHORS)

  This code is licensed under the MIT license:
  http://www.opensource.org/licenses/mit-license.php

  Various utility functions
*/

// helper functions for picking up signed, unsigned, little endian, etc from an unsigned 8-bit buffer
export function le_word(buffer, offset) {
  return buffer[offset]|(buffer[offset+1]<<8);
}
export function le_dword(buffer, offset) {
  return buffer[offset]|(buffer[offset+1]<<8)|(buffer[offset+2]<<16)|(buffer[offset+3]<<24);
}
export function s_byte(buffer, offset) {
  return (buffer[offset]<128)?buffer[offset]:(buffer[offset]-256);
}
export function s_le_word(buffer, offset) {
  return (le_word(buffer,offset)<32768)?le_word(buffer,offset):(le_word(buffer,offset)-65536);
}

// convert from MS-DOS extended ASCII to Unicode
export function dos2utf(c) {
  if (c<128) return String.fromCharCode(c);
  var cs=[
    0x00c7, 0x00fc, 0x00e9, 0x00e2, 0x00e4, 0x00e0, 0x00e5, 0x00e7, 0x00ea, 0x00eb, 0x00e8, 0x00ef, 0x00ee, 0x00ec, 0x00c4, 0x00c5,
    0x00c9, 0x00e6, 0x00c6, 0x00f4, 0x00f6, 0x00f2, 0x00fb, 0x00f9, 0x00ff, 0x00d6, 0x00dc, 0x00f8, 0x00a3, 0x00d8, 0x00d7, 0x0192,
    0x00e1, 0x00ed, 0x00f3, 0x00fa, 0x00f1, 0x00d1, 0x00aa, 0x00ba, 0x00bf, 0x00ae, 0x00ac, 0x00bd, 0x00bc, 0x00a1, 0x00ab, 0x00bb,
    0x2591, 0x2592, 0x2593, 0x2502, 0x2524, 0x00c1, 0x00c2, 0x00c0, 0x00a9, 0x2563, 0x2551, 0x2557, 0x255d, 0x00a2, 0x00a5, 0x2510,
    0x2514, 0x2534, 0x252c, 0x251c, 0x2500, 0x253c, 0x00e3, 0x00c3, 0x255a, 0x2554, 0x2569, 0x2566, 0x2560, 0x2550, 0x256c, 0x00a4,
    0x00f0, 0x00d0, 0x00ca, 0x00cb, 0x00c8, 0x0131, 0x00cd, 0x00ce, 0x00cf, 0x2518, 0x250c, 0x2588, 0x2584, 0x00a6, 0x00cc, 0x2580,
    0x00d3, 0x00df, 0x00d4, 0x00d2, 0x00f5, 0x00d5, 0x00b5, 0x00fe, 0x00de, 0x00da, 0x00db, 0x00d9, 0x00fd, 0x00dd, 0x00af, 0x00b4,
    0x00ad, 0x00b1, 0x2017, 0x00be, 0x00b6, 0x00a7, 0x00f7, 0x00b8, 0x00b0, 0x00a8, 0x00b7, 0x00b9, 0x00b3, 0x00b2, 0x25a0, 0x00a0
  ];
  return String.fromCharCode(cs[c-128]);
}