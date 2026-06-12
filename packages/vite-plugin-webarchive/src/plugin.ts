import type { Plugin, ResolvedConfig } from "vite";
import { WebArchive } from "./webarchive.js";
import { lookup } from "mime-types";

interface PluginOptions {
  name: string;
  onlyWebArchive?: boolean;
}

export function webarchive(pluginOpts: PluginOptions): Plugin {
  let config: ResolvedConfig | undefined = undefined;
  return {
    name: "vite-plugin-webarchive",
    enforce: "post",
    apply: "build",
    configResolved(providedConfig) {
      config = providedConfig;
    },
    async generateBundle(opts, bundle) {
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
        if (pluginOpts.onlyWebArchive) {
          delete bundle[resource.fileName];
        }
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

      this.emitFile({
        type: "asset",
        fileName: `${pluginOpts.name}.webarchive`,
        name: pluginOpts.name,
        source: Buffer.from(archive.encode()),
      });

    },
  };
}
