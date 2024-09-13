import { getPath } from "../paths";

export default [
  { // enemies
    500: [ // frame
      1, // total
      1000, // interval (ms) frame = 1000 / 1000 * 60 = 60
      9, // sprite
      true, // rotate
      false, // loop
      10, // shield
      0, // fire mode
      30, // fire rate
      getPath('spiral'), // path
    ],
  },
  { // asteroids
    // 1000: [
    //   13, // total
    //   1000, // interval ms
    //   [20, 200, 120, 180, 60, 220, 180, 40, 120, 60], // x positions
    //   [0, -.1, 0, -.1, .1, -.1, 0, .1, 0, .1], // dx speeds
    //   [1, .5, .7, .5, .9, .5, 1, .8, .4, .7], // dy speeds
    // ],
  }, 
  { // powerups
    1500: [
      'fire', // type
      128, // x
      .6, // velocity
    ],
    2500: [
      'shield', // type
      140, // x
      .3, // velocity
    ],
    3500: [
      'fire', // type
      128, // x
      .6, // velocity
    ],
  },
  { // dialogs
    // 100: [
    //   false, // pause gameplay
    //   [
    //     '13 ASTEROIDS DETECTED',
    //     '      ',
    //     'OOOPSS...',
    //     'HOPE THIS DOES NOT TRIGGER',
    //     'YOUR TRISKAIDEKAPHOBIA...',
    //     '         ',
    //   ], // texts
    // ],
  },
  [ // boss
    0, // sprite
    20, // shield
    110, // fire rate
    getPath('spiral'), // path
    100, // boss radius
    8, // total children
    9, // children sprite
    1, // fire mode children
    60, // children speed
    100, // children fire rate
  ],
];