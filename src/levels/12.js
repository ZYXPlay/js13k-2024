import { getPath } from "../paths";
export default [
  { // enemies
    500: [
      10, // total
      400, // interval
      3, // sprite
      false, // rotate
      false, // loop
      2, // shield
      0, // fire mode
      200, // fire rate
      getPath('zzLeft'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
    800: [
      10, // total
      400, // interval
      4, // sprite
      false, // rotate
      false, // loop
      2, // shield
      0, // fire mode
      200, // fire rate
      getPath('zzRight'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
    1500: [
      10, // total
      400, // interval
      3, // sprite
      false, // rotate
      false, // loop
      2, // shield
      0, // fire mode
      200, // fire rate
      getPath('zzLeft'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
    1800: [
      10, // total
      400, // interval
      4, // sprite
      false, // rotate
      false, // loop
      2, // shield
      0, // fire mode
      200, // fire rate
      getPath('zzRight'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
    2500: [
      5, // total
      1000, // interval
      6, // sprite
      false, // rotate
      false, // loop
      1, // shield
      0, // fire mode
      40, // fire rate
      getPath('spiral'), // path
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
        'HMMM... ZIGZAGERS?',
        '    ',
      ], // texts
    ],
  },
  [ // boss
    // 0, // sprite
    // 10, // shield
    // 350, // fire rate
    // getPath('spiral'), // path
    // // 'M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z', // path
    // 30, // boss radius
    // 4, // total children
    // 3, // children sprite
    // 0, // fire mode children
    // 60, // children speed
    // 450, // children fire rate
  ],
];