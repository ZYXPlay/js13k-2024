export default [ // waves
  [
    100, // start at frame
    false, // wait for previous wave
    20, // enemy type
    false, // rotate
    10, // shield
    10, // total
    130, // interval
    false, // loop
    0, // mode
    '', // path
    [], // dialogs
    [], // powerups
    [], // children
    [40, 200, 120, 180, 60, 220, 180, 40, 120, 60], // x positions
    [1, -1, 0, -1, 1, -1, 0, 1, 0, 1], // dx speeds
  ],
  [ // wave
    1300, // start at frame
    false, // wait for previous wave
    4, // enemy type
    false, // rotate
    1, // shield
    2, // total
    330, // interval
    false, // loop
    0, // mode
    'M1 1s162 189 172 199c11 10 30 35 59 24 29-12 9-54 0-65L120 37S99 11 71 15c-27 3-46 47-46 47S4 106 4 126s-3 67 11 77c15 10 55 41 79 9L247 1', // path
    [ // dialogs
      // [ // dialog
      //   99, // frame
      //   0, // character
      //   true, // pause gameplay
      //   [ // texts
      //     'CAPTAIN',
      //     'WE HAVE DETECTED',
      //     'SOME ENEMY SCOUTS',
      //     'A FULL WAVE IS IMINENT',
      //     '    ',
      //     'PROCEED WITH CAUTION',
      //     'AND GOOD LUCK!'
      //   ],
      // ],
      // [ // dialog
      //   420, // frame
      //   0, // character
      //   true, // pause gameplay
      //   [ // texts
      //     'WE DEPLOYED SOME POWERUPS',
      //     '',
      //     'TO ENHANCE YOUR FIRE POWER',
      //     'AND RECHARGE YOUR SHIELD',
      //   ],
      // ],
    ],
    [ // powerups
      [ // powerup
        410, // frame
        120, // x
        1, // speed
        0, // type
        10, // value
      ],
      [ // powerup
        730, // frame
        200, // x
        1, // speed
        1, // type
        10, // value
      ],
    ],
  ],
  [
    1500, // start at frame
    true, // wait for previous wave
    5, // enemy type
    true, // rotate
    2, // shield
    3, // total
    60, // interval
    false, // loop
    0, // mode
    'M223-33v238c0 42-61 41-61 0V41c0-44-64-44-64 0v164c0 43-71 33-71 0V-27', // path
    [],
    [],
  ],
];

const newLevel = [
  '', // title
  1, // star field speed
  [], // enemies
  [], // asteroids
  [], // boss
  [], // dialogs
  [], // powerups
];