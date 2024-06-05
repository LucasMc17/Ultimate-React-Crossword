import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import PeerDepsExternalPlugin from "rollup-plugin-peer-deps-external";

const devMode = process.env.NODE_ENV === "development";

console.log(`${devMode ? "development" : "production"} mode bundle`);

export default [
  {
    input: "src/index.jsx",
    output: {
      file: "dist/index.js",
      format: "es",
    },
    external: ["react", "react-dom"],
    plugins: [
      PeerDepsExternalPlugin(),
      nodeResolve(),
      json(),
      commonjs(),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
        presets: [["@babel/preset-react", { runtime: "automatic" }]],
      }),
      !devMode &&
        terser({
          ecma: 2020,
          mangle: { toplevel: true },
          compress: {
            module: true,
            toplevel: true,
            unsafe_arrows: true,
            drop_console: true,
            drop_debugger: true,
          },
          output: { quote_style: 1 },
        }),
    ],
  },
];
