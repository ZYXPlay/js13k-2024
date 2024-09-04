import { createPath } from '../lib/utils';
import l01 from './01';
import l02 from './02';

export function getLevel(level, virtualLevel) {
  switch (level) {
    case 1:
      return parseLevel(l01, virtualLevel);
    case 2:
      return parseLevel(l02, virtualLevel);
    default:
      return parseLevel(l01, virtualLevel);
  }
}

export const totalLevels = 2;

function parseDialog(dialog) {
  const [frame, character, pause, texts] = dialog;
  return {
    frame,
    character,
    pause,
    texts,
  };
}

function parsePowerup(powerup) {
  const [frame, x, speed, type, value] = powerup;
  return {
    frame,
    x,
    speed,
    type,
    value,
  };
}

function parseLevel(level, virtualLevel) {
  const waves = [];

  level.forEach((wave) => {
    const [frame, previous, sprite, rotate, shield, total, interval, loop, mode, path, dialogs, powerups, children = []] = wave;
    waves.push({
      frame,
      previous,
      sprite,
      rotate,
      shield,
      total: children.length > 0 ? total : total + Math.floor(virtualLevel / 4),
      interval,
      loop,
      mode,
      path: createPath(path),
      dialogs: dialogs.map(parseDialog),
      powerups: powerups.map(parsePowerup),
      count: 0,
      completed: false,
      killed: 0,
      children,
    });
  });

  return { waves };
}