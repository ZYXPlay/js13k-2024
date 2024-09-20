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
  external: [
    'BassoonTracker',
    'BassoonTracker.init',
  ],
  treeshake: true,
  plugins: [
    nodeResolve(),
    copy({
      targets: [
        { src: 'src/index.html', dest: 'build' },
        { src: 'assets/font.png', dest: 'build' },
        { src: 'assets/spritesheet.png', dest: 'build' },
        { src: 'assets/spritesheet16.png', dest: 'build' },
        { src: 'src/lib/b-zip.js', dest: 'build' },
        { src: 'assets/m_newhor.mod', dest: 'build', rename: 'menu.mod' },
        { src: 'assets/dubmood_zabutom-track_tracking_compo_edit.xm', dest: 'build', rename: 'music.xm' },
        { src: 'assets/m_farewl.mod', dest: 'build', rename: 'game-over.mod' },
      ],
    }),
    execute([
      // `npx google-closure-compiler --js=build/game.js --js_output_file=build/out.js --compilation_level=ADVANCED --language_out=ECMASCRIPT_2021 --warning_level=VERBOSE --jscomp_off=* --assume_function_wrapper`,
      `npx uglifyjs build/game.js -c -m -o build/game.js`,
      // `node_modules/ect-bin/vendor/macos/ect -9 -zip -strip build/game.zip build/game.js build/index.html`,
      // `rm build/out.js`,
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