import { emit } from "../engine/events";
import { createPath } from "../engine/utils";
import l01 from "./01";
import l02 from "./02";
import l03 from "./03";

const levels = [
  l01,
  l02,
  l03,
];

function parseEnemy(data) {
  return {
    sprite: data[2],
    rotate: data[3],
    loop: data[4],
    shield: data[5],
    fireMode: data[6],
    fireRate: data[7],
    path: createPath(data[8]),
  };
}

export function getLevelLastFrame(index) {
  const level = levels[index];
  // Get the max frame from all level.
  let lastFrame = Math.max(
    ...Object.keys(level[0]),
    ...Object.keys(level[1]),
  );

  // Get info from last enemy/asteroid and calculate the last frame
  // taking into total and interval.
  let o = level[0][lastFrame];
  o ?? (o = level[1][lastFrame]);
  lastFrame += o[1] / 1000 * 60 * o[0];

  return lastFrame;
}

export const totalLevels = levels.length;

export function processLevel(frame = 0, currentLevel = 0, totalActiveEnemies = 0, canSpawnBoss = false) {
  const level = levels[currentLevel];
  const lastFrame = getLevelLastFrame(currentLevel);

  // Enemies
  if (level[0][frame]) {
    const o = level[0][frame];
    emit('spawn-enemy', o[0], o[1], parseEnemy(o));
  }

  // Asteroids
  if (level[1][frame]) {
    emit('spawn-asteroid', ...level[1][frame]);
  }

  // Powerups
  if (level[2][frame]) {
    emit('spawn-powerup', ...level[2][frame]);
  }

  // Dialogs
  if (level[3][frame]) {
    emit('set-dialog', ...level[3][frame]);
  }

  // No boss? Go to next level.
  if (level[4].length === 0 && frame >= lastFrame && totalActiveEnemies === 0) {
    const newLevel = currentLevel + 1 >= totalLevels ? 0 : currentLevel + 1;
    emit('next-level', newLevel);
  }

  // Boss
  if (level[4].length > 0 && canSpawnBoss && totalActiveEnemies === 0) {
    emit('spawn-boss', ...level[4]);
  }
}