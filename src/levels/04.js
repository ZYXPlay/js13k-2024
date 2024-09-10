import { getPath } from "../paths";
export default [
  { // enemies
    800: [
      5, // total
      400, // interval
      9, // sprite
      true, // rotate
      false, // loop
      4, // shield
      0, // fire mode
      400, // fire rate
      getPath('zigzag'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
    810: [
      5, // total
      400, // interval
      9, // sprite
      true, // rotate
      false, // loop
      4, // shield
      0, // fire mode
      400, // fire rate
      getPath('zigzagLeft'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
    2000: [
      5, // total
      400, // interval
      7, // sprite
      true, // rotate
      false, // loop
      4, // shield
      0, // fire mode
      400, // fire rate
      getPath('w'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
    2010: [
      5, // total
      400, // interval
      7, // sprite
      true, // rotate
      false, // loop
      4, // shield
      0, // fire mode
      400, // fire rate
      getPath('wReversed'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
  },
  { // asteroids
  }, 
  { // powerups
    1500: [
      'fire', // type
      128, // x
      .6, // velocity
    ],
  },
  { // dialogs
    100: [
      false, // pause gameplay
      [
        'THAT CONDITION STILL',
        'AFFECTING YOUR',
        'VISION, HUH!?',
        '         ',
      ], // texts
    ],
  },
  [ // boss
    0, // sprite
    10, // shield
    250, // fire rate
    getPath('sandClock'), // path
    // 'M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z', // path
    30, // boss radius
    8, // total children
    8, // children sprite
    0, // fire mode children
    10, // children speed
    50, // children fire rate
  ],
];