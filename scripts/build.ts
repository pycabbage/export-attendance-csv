import { build, type BuildOptions } from "esbuild"
import { swcPlugin } from "esbuild-plugin-swc"
import { createBanner, dateISO } from "./banner"
import packageJson from "../package.json"
import { env } from "process"

await build({
  bundle: true,
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.user.js",
  platform: "browser",
  plugins: [swcPlugin({
    minify: env.NODE_ENV === "production",
  })],
  minify: env.NODE_ENV === "production",
  treeShaking: env.NODE_ENV === "production",
  banner: {
    js: createBanner({
      name: "MF勤怠をCSVにエクスポート",
      description: "MF勤怠をCSVにエクスポート",
      version: `${packageJson.version}-${dateISO()}${env.NODE_ENV !== "production" ? "-dev" : ""}`,
      match: "https://attendance.moneyforward.com/my_page/attendances"
    }) + "\n"
  }
} as BuildOptions)
