export default [ // waves
  [
    100, // start at frame
    true, // wait for previous wave
    5, // enemy type
    true, // rotate
    2, // shield
    3, // total
    60, // interval
    false, // loop
    0, // mode
    'M287 12.5L-21 60.5L272 106.5L-21 137.5L272 185.5L-18.5 237.5', // path
    [],
    [],
  ],
  [ // wave
    400, // start at frame
    false, // wait for previous wave
    0, // enemy type
    false, // rotate
    10, // shield
    1, // total
    50, // interval
    true, // loop
    2, // fire mode
    'M131 57s-56 130 0 129c57 0 99-32 69-67s-33-85-69-75-71 38-71 75c1 37 25 52 64 51 39 0 61-22 60-51-1-30-21-46-47-47-25-1-56 17-56 47 0 29 12 32 43 29s39-11 39-29-6-25-26-25-32 4-36 25c-3 20 9 18 23 11 13-7 17-11 17-11', // path
    // 'M244 12H22c-14 0-11 9 0 9h214c17 0 17 10 0 10H22C4 31 8 43 22 43h214c20 0 19 15 0 15H22C6 58 6 71 22 71h244', // path
    [ // dialogs
      [ // dialog
        99, // frame
        0, // character
        true, // pause gameplay
        [ // texts
          'SOMETHING BIG IS COMING',
        ],
      ],
    ],
    [ // powerups
      [ // powerup
        200, // frame
        120, // x
        .5, // speed
        0, // type
        10, // value
      ],
      [ // powerup
        400, // frame
        200, // x
        .5, // speed
        1, // type
        10, // value
      ],
      [ // powerup
        1600, // frame
        200, // x
        .5, // speed
        0, // type
        10, // value
      ],
      [ // powerup
        2900, // frame
        120, // x
        .5, // speed
        0, // type
        10, // value
      ],
    ],
    [ // children
      [ // child
        8, // enemy type
        false, // rotate
        1, // shield
        16, // total
        0, // fire mode
      ],
    ],
  ],
  [ // wave
    1000, // start at frame
    false, // wait for previous wave
    0, // enemy type
    false, // rotate
    5, // shield
    1, // total
    50, // interval
    true, // loop
    2, // fire mode
    // 'M131 57s-56 130 0 129c57 0 99-32 69-67s-33-85-69-75-71 38-71 75c1 37 25 52 64 51 39 0 61-22 60-51-1-30-21-46-47-47-25-1-56 17-56 47 0 29 12 32 43 29s39-11 39-29-6-25-26-25-32 4-36 25c-3 20 9 18 23 11 13-7 17-11 17-11', // path
    'M244 12H22c-14 0-11 9 0 9h214c17 0 17 10 0 10H22C4 31 8 43 22 43h214c20 0 19 15 0 15H22C6 58 6 71 22 71h244', // path
    [ // dialogs
    ],
    [ // powerups
    ],
    [ // children
      [ // child
        5, // enemy type
        false, // rotate
        1, // shield
        4, // total
        1, // fire mode
      ],
    ],
  ],
];