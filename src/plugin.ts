import type { Plugin, ResolvedConfig } from "vite";
import { WebArchive } from "./webarchive.js";
import fs from "fs/promises";

export function webarchive(): Plugin {
  let config: ResolvedConfig | undefined = undefined;
  return {
    name: "vite-plugin-webarchive",
    enforce: "pre",
    configResolved(providedConfig) {
      config = providedConfig;
    },
    async writeBundle(opts, bundle) {
      if (!config?.base) {
        throw new Error("base must be set in vite config");
      }
      const indexHTML = bundle["index.html"];
      if (!indexHTML || indexHTML.type !== "asset") {
        throw new Error("No index.html found in bundle");
      }

      const archive = new WebArchive({
        WebResourceMIMEType: "text/html",
        WebResourceURL: config.base,
        WebResourceData: new TextEncoder().encode(indexHTML.source as string)
          .buffer,
      });

      const projectDir = new URL(opts.dir! + "/", "file://");
      const outDir = new URL(config.build.outDir, projectDir);
      const targetFileName = new URL("./index.webarchive", outDir);
      console.log(targetFileName);

      await fs.writeFile(targetFileName, Buffer.from(archive.encode()));
    },
  };
}
