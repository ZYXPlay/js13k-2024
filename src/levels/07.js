import { getPath } from "../paths";
export default [
  { // enemies
    500: [
      3, // total
      400, // interval
      4, // sprite
      true, // rotate
      false, // loop
      4, // shield
      1, // fire mode
      100, // fire rate
      getPath('spiral'), // path
    ],
    2000: [
      3, // total
      1000, // interval
      5, // sprite
      true, // rotate
      false, // loop
      4, // shield
      1, // fire mode
      100, // fire rate
      getPath('sandClock'), // path
    ],
  },
  { // asteroids
    500: [
      30, // total
      700, // interval ms
      [220, 180, 40, 120, 60, 20, 200, 120, 180, 60], // x positions
      [-.1, 0, .1, 0, .1, 0, -.1, 0, -.1, .1], // dx speeds
      [.5, 1, .8, .4, .7, 1, .5, .7, .5, .9], // dy speeds
    ],
  }, 
  { // powerups
    1500: [
      'shield', // type
      128, // x
      .6, // velocity
    ],
    500: [
      'fire', // type
      64, // x
      .3, // velocity
    ],
  },
  { // dialogs
    // 100: [
    //   false, // pause gameplay
    //   [
    //     'CAPTAIN',
    //     '    ',
    //     'WE DETECTED SOME ENEMY SCOUTS',
    //     'BETTER DESTROY THEM'
    //   ], // texts
    // ],
  },
  [ // boss
    0, // sprite
    60, // shield
    150, // fire rate
    getPath('sandClock'), // path
    30, // boss radius
    16, // total children
    8, // children sprite
    1, // fire mode children
    100, // children speed
    50, // children fire rate
  ],
];