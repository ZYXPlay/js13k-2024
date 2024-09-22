import copy from 'rollup-plugin-copy';
import nodeResolve from '@rollup/plugin-node-resolve';
import execute from 'rollup-plugin-execute';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default [{
  input: "./src/index.js",
  output: {
    file: 'build/game.js',
    format: 'cjs',
    sourcemap: true,
  },
  treeshake: true,
  plugins: [
    nodeResolve(),
    copy({
      targets: [
        { src: 'src/index.html', dest: 'build' },
        { src: 'assets/font.png', dest: 'build' },
        { src: 'assets/spritesheet.png', dest: 'build' },
        { src: 'assets/spritesheet16.png', dest: 'build' },
        { src: 'assets/flc_saha.xm', dest: 'build', rename: 'menu.xm' },
        { src: 'assets/dubmood_zabutom-track_tracking_compo_edit.xm', dest: 'build', rename: 'music-1.xm' },
        { src: 'assets/viraxor_-_game_over.xm', dest: 'build', rename: 'game-over.xm' },
      ],
    }),
    execute([
      // `rm -rf build/game.zip`,
      `npx google-closure-compiler --js=build/game.js --js_output_file=build/out.js --compilation_level=ADVANCED --language_out=ECMASCRIPT_2021 --warning_level=VERBOSE --jscomp_off=* --assume_function_wrapper`,
      `npx uglifyjs build/out.js -c -m -o build/game.js`,
      // `node_modules/ect-bin/vendor/macos/ect -9 -zip -strip build/game.zip build/game.js build/index.html font.png spritesheet.png spritesheet16.png menu.xm music-1.xm game-over.xm`,
      `rm -rf build/out.js`,
      // `rm build/game.release.js`,
    ]),
    serve({
      open: true,
      contentBase: 'build',
    }),
    livereload({
      watch: 'build',
    }),
  ],
}];