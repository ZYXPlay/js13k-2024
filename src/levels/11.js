import { getPath } from "../paths";
export default [
  { // enemies
    2500: [
      13, // total
      200, // interval
      5, // sprite
      true, // rotate
      true, // loop
      1, // shield
      0, // fire mode
      50, // fire rate
      getPath('spiral'), // path
      // 'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    ],
  },
  { // asteroids
    10: [
      60, // total
      400, // interval ms
      [20, 200, 120, 180, 60, 220, 180, 40, 120, 60], // x positions
      [0, -.1, 0, -.1, .1, -.1, 0, .1, 0, .1], // dx speeds
      [1, .5, .7, .5, .9, .5, 1, .8, .4, .7], // dy speeds
    ],
  }, 
  { // powerups
    1500: [
      'fire', // type
      128, // x
      .6, // velocity
    ],
  },
  { // dialogs
    3000: [
      false, // pause gameplay
      [
        'CONTROL YOURSELF, CAPTAIN!',
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