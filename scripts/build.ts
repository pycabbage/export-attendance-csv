import { build, type BuildOptions } from "esbuild"
import { swcPlugin } from "esbuild-plugin-swc"
import { createBanner } from "./banner"
import packageJson from "../package.json"
import { env } from "process"

await build({
  bundle: true,
  entryPoints: ["src/index.ts"],
  outfile: "dist/export-attendance-csv.user.js",
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
      version: `${packageJson.version}${env.NODE_ENV !== "production" ? `-dev-${new Date().toISOString().replaceAll(/[-:\.TZ]/g, "")}` : ""}`,
      match: "https://attendance.moneyforward.com/my_page/attendances",
      updateURL: "https://github.com/pycabbage/export-attendance-csv/releases/latest/download/export-attendance-csv.user.js",
      downloadURL: "https://github.com/pycabbage/export-attendance-csv/releases/latest/download/export-attendance-csv.user.js",
      supportURL: "https://github.com/pycabbage/export-attendance-csv"
    }) + "\n"
  }
} as BuildOptions)
