import { z } from "zod";

const ZBannerOption = z.object({
  name: z.string(),
  namespace: z.string(),
  version: z.string(),
  description: z.string(),
  author: z.string(),
  match: z.string(),
  icon: z.string(),
  grant: z.string()
})
type TBannerOption = z.infer<typeof ZBannerOption>

export const dateISO = () => new Date()
  .toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
  .replaceAll('/', '-')

const defaultOptions: TBannerOption = {
  name: "New Userscript",
  namespace: "http://tampermonkey.net/",
  version: dateISO(),
  description: "try to take over the world!",
  author: "You",
  match: "http://*/*",
  icon: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
  grant: "none"
}


export const createBanner = z.function(
  z.tuple([ZBannerOption.partial()]),
  z.string()
).implement((data: Partial<TBannerOption> = {}) => {
  const options = ZBannerOption.parse({...defaultOptions, ...data})
  if (options.icon === defaultOptions.icon) {
    options.icon = `https://www.google.com/s2/favicons?sz=64&domain=${new URL(options.match).hostname}`
  }
  if (options.namespace === defaultOptions.namespace) {
    options.namespace = `${new URL(options.match).origin}/`
  }

  const maximimKeyLength = Math.max(...Object.keys(options).map(key => key.length))
  const banners: string[] = [
    "// ==UserScript==",
    ...Object.keys(options).map(key => `// @${key.padEnd(maximimKeyLength)}  ${options[key as keyof TBannerOption]}`),
    "// ==/UserScript==",
  ]

  return banners.join("\n")
})
