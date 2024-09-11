export default [
  { // enemies
    // 2000: [ // frame
    //   3, // total
    //   1000, // interval (ms) frame = 1000 / 1000 * 60 = 60
    //   3, // sprite
    //   true, // rotate
    //   false, // loop
    //   1, // shield
    //   0, // fire mode
    //   200, // fire rate
    //   'M223-33v238c0 42-61 41-61 0V41c0-44-64-44-64 0v164c0 43-71 33-71 0V-27', // path
    // ],
    // 1000: [
    //   5, // total
    //   1500, // interval
    //   6, // sprite
    //   false, // rotate
    //   false, // loop
    //   1, // shield
    //   0, // fire mode
    //   130, // fire rate
    //   'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    // ],
    // 3000: [
    //   5, // total
    //   1500, // interval
    //   8, // sprite
    //   true, // rotate
    //   false, // loop
    //   1, // shield
    //   0, // fire mode
    //   130, // fire rate
    //   'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    // ],
    // 4000: [
    //   5, // total
    //   1500, // interval
    //   6, // sprite
    //   false, // rotate
    //   false, // loop
    //   1, // shield
    //   0, // fire mode
    //   130, // fire rate
    //   'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    // ],
    // 5000: [
    //   5, // total
    //   1500, // interval
    //   6, // sprite
    //   false, // rotate
    //   false, // loop
    //   1, // shield
    //   0, // fire mode
    //   130, // fire rate
    //   'M287 13-21 61l293 46-293 31 293 48-290 52', // path
    // ],
  },
  { // asteroids
    1000: [
      13, // total
      1000, // interval ms
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
    100: [
      false, // pause gameplay
      [
        '13 ASTEROIDS DETECTED',
        '      ',
        'OOOPSS...',
        'HOPE THIS DOES NOT TRIGGER',
        'YOUR TRISKAIDEKAPHOBIA...',
        '         ',
      ], // texts
    ],
  },
  [ // boss
    0, // sprite
    10, // shield
    100, // fire rate
    'M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z', // path
    40, // boss radius
    4, // total children
    9, // children sprite
    1, // fire mode children
    60, // children speed
    50, // children fire rate
  ],
];