import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";

export default {
  input: "packages/core/index.ts",
  output: {
    file: "dist/index.js",
    format: "esm",
    sourcemap: true,
  },
  plugins: [
    resolve({
      extensions: [".js", ".ts"], // Ensure .js and .ts extensions are resolved
    }),
    commonjs(),
    typescript(),
    copy({
      targets: [
        { src: "assets/**/*", dest: "assets" },
        { src: "packages/core/dist/**/*", dest: "" },
      ],
      flatten: false,
    }),
  ],
};
