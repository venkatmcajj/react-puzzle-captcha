const typescript = require("rollup-plugin-typescript2");
const pkg = require("./package.json");
const terser = require("@rollup/plugin-terser");
const json = require("@rollup/plugin-json");
const peerDepsExternal = require("rollup-plugin-peer-deps-external");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
// const sass = require("rollup-plugin-sass");
const less = require("rollup-plugin-less");
module.exports = {
    input: "src/index.ts",
    output: [
        {
            file: pkg.main,
            format: "cjs",
            sourcemap: true
        },
        {
            file: pkg.module,
            format: "esm",
            sourcemap: true
        },
        {
            file: pkg.browser,
            format: "umd",
            sourcemap: true,
            name: 'ReactSliderVerify'
        }
    ],
    plugins: [
        peerDepsExternal(),
        resolve(),
        commonjs(),
        typescript({ useTsconfigDeclarationDir: true }),
        less({ output: './dist/react-slider-verify.css' }),
        json(),
        terser()
    ]
};