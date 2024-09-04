import { createPath } from '../lib/utils';
import l01 from './01';
import l02 from './02';
import l03 from './03';
import l04 from './04';

const levels = [l01, l02, l03, l04];

export function getLevel(level, virtualLevel) {
  return parseLevel(levels[level - 1], virtualLevel);
}

export const totalLevels = levels.length;

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
    const [frame, previous, sprite, rotate, shield, total, interval, loop, fireMode, path, dialogs, powerups, children = []] = wave;
    waves.push({
      frame,
      previous,
      sprite,
      rotate,
      shield,
      total: children.length > 0 ? total : total + Math.floor(virtualLevel / 4),
      interval,
      loop,
      fireMode,
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