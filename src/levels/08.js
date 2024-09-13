import { getPath } from "../paths";

export default [
  { // enemies
    500: [ // frame
      5, // total
      1000, // interval (ms) frame = 1000 / 1000 * 60 = 60
      9, // sprite
      true, // rotate
      false, // loop
      1, // shield
      0, // fire mode
      100, // fire rate
      getPath('w'), // path
    ],
    501: [
      5, // total
      1000, // interval
      9, // sprite
      true, // rotate
      false, // loop
      1, // shield
      0, // fire mode
      100, // fire rate
      getPath('wReversed'), // path
    ],
    1500: [
      5, // total
      1000, // interval
      3, // sprite
      false, // rotate
      false, // loop
      1, // shield
      0, // fire mode
      100, // fire rate
      getPath('zzLeft'), // path
    ],
    1501: [
      5, // total
      1000, // interval
      3, // sprite
      false, // rotate
      false, // loop
      1, // shield
      0, // fire mode
      100, // fire rate
      getPath('zzRight'), // path
    ],
  },
  { // asteroids
    // 2000: [
    //   20, // total
    //   1000, // interval ms
    //   [20, 200, 120, 180, 60, 220, 180, 40, 120, 60], // x positions
    //   [.1, -.1, 0, -.1, .1, -.1, 0, .1, 0, .1], // dx speeds
    //   [1, .5, .7, .5, .9, .5, 1, .8, .4, .7], // dy speeds
    // ],
  }, 
  { // powerups
    2500: [
      'fire', // type
      128, // x
      .6, // velocity
    ],
    550: [
      'shield', // type
      140, // x
      .3, // velocity
    ],
  },
  { // dialogs
    100: [
      false, // pause gameplay
      [
        'THEY JUST KEEP COMING',
      ], // texts
    ],
    // 500: [
    //   false, // pause gameplay
    //   [
    //     'A FULL WAVE IS IMINENT',
    //     '    ',
    //   ], // texts
    // ],
  },
  [ // boss
    // 0, // sprite
    // 10, // shield
    // 50, // fire rate
    // 'M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z', // path
    // 30, // boss radius
    // 8, // total children
    // 9, // children sprite
    // 1, // fire mode children
    // 20, // children speed
    // 150, // children fire rate
  ],
];