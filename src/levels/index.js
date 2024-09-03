import { createPath } from '../lib/utils';
import l01 from './01';

export function getLevel(level, virtualLevel) {
  switch (level) {
    case 1:
      return parseLevel(l01, virtualLevel);
    default:
      return parseLevel(l01, virtualLevel);
  }
}

export const totalLevels = 1;

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
    const [frame, previous, sprite, rotate, total, interval, loop, mode, path, dialogs, powerups] = wave;
    waves.push({
      frame,
      previous,
      sprite,
      rotate,
      total: total + Math.floor(virtualLevel / 4),
      interval: interval - virtualLevel > 5 ? interval - virtualLevel : 5,
      loop,
      mode,
      path: createPath(path),
      dialogs: dialogs.map(parseDialog),
      powerups: powerups.map(parsePowerup),
      count: 0,
      completed: false,
      killed: 0,
    });
  });

  return {waves};
}