import { build } from "esbuild"
import { swcPlugin } from "esbuild-plugin-swc"
import deployData from "./deploy.json"

await build({
  bundle: true,
  entryPoints: ["src/index.ts"],
  // format: "cjs",
  outfile: "dist/index.js",
  platform: "browser",
  plugins: [swcPlugin({
    minify: true,
  })],
  minify: true,
  treeShaking: true,
  banner: {
  }
})
