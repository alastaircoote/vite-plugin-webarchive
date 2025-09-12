import type { Plugin, ResolvedConfig } from "vite";
import { WebArchive } from "./webarchive.js";
import fs from "fs/promises";
import { lookup } from "mime-types";

interface PluginOptions {
  name: string;
}

export function webarchive(opts: PluginOptions): Plugin {
  let config: ResolvedConfig | undefined = undefined;
  return {
    name: "vite-plugin-webarchive",
    enforce: "pre",
    configResolved(providedConfig) {
      config = providedConfig;
    },
    async writeBundle(opts, bundle) {
      if (!config?.base) {
        /**
         * The web archive needs to provide absolute URLs for all the files within it.
         */
        throw new Error("base must be set in vite config");
      }
      try {
        new URL(config.base);
      } catch (error) {
        throw new Error(
          `Base URL must be a full absolute URL, we were provided: ${config.base}`
        );
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

      for (const resource of Object.values(bundle)) {
        if (resource.fileName === "index.html") {
          // already added it as the main resource
          continue;
        }
        const absoluteURL = new URL(resource.fileName, config.base);

        const sourceInOriginalForm =
          resource.type === "chunk" ? resource.code : resource.source;

        const sourceAsArrayBuffer =
          typeof sourceInOriginalForm === "string"
            ? new TextEncoder().encode(sourceInOriginalForm).buffer
            : (sourceInOriginalForm.buffer as ArrayBuffer);

        archive.addSubResource(
          {
            url: absoluteURL.href,
            statusCode: 200,
            headers: {
              "Content-Type":
                lookup(resource.fileName) || "application/octet-stream",
              "Content-Length": `${sourceAsArrayBuffer.byteLength}`,
            },
          },
          sourceAsArrayBuffer
        );
      }

      const projectDir = new URL(opts.dir! + "/", "file://");
      const outDir = new URL(config.build.outDir, projectDir);
      const targetFileName = new URL(`./${opts.name}.webarchive`, outDir);

      await fs.writeFile(targetFileName, Buffer.from(archive.encode()));
    },
  };
}
