import copy from 'rollup-plugin-copy';
import nodeResolve from '@rollup/plugin-node-resolve';
import execute from 'rollup-plugin-execute';

export default [{
  input: "./src/index.js",
  output: {
    file: 'build/game.release.js',
    format: 'iife',
    sourcemap: false,
  },
  treeshake: true,
  plugins: [
    nodeResolve(),
    copy({
      targets: [
        { src: 'src/index.html', dest: 'build' },
        { src: 'assets/font.png', dest: 'build' },
        { src: 'assets/spritesheet.png', dest: 'build' },
      ],
    }),
    execute([
      `npx google-closure-compiler --js=build/game.release.js --js_output_file=build/out.js --compilation_level=ADVANCED --language_out=ECMASCRIPT_2021 --warning_level=VERBOSE --jscomp_off=* --assume_function_wrapper`,
      `npx uglifyjs build/out.js -c -m -o build/game.js`,
      `rm build/out.js`,
      `rm build/game.release.js`,
    ]),
  ],
}];