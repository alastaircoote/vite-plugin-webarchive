import { serialize } from "@plist/plist";
import { Dictionary, PlistFormat } from "@plist/common";
import {
  NSHTTPURLResponse,
  ResponseData,
} from "./archive-objects/nshttpurlresponse.js";
import { KeyedArchive } from "./keyed-archive.js";
export type { ResponseData } from "./archive-objects/nshttpurlresponse.js";

interface WebResource extends Dictionary {
  WebResourceMIMEType: string;
  WebResourceURL: string;
  WebResourceData: ArrayBuffer;
}

interface MainWebResource extends WebResource {
  WebResourceFrameName: "";
  WebResourceTextEncodingName: "UTF-8";
}

interface WebSubResource extends WebResource {
  WebResourceResponse: ArrayBuffer;
}

export class WebArchive {
  #mainResource: MainWebResource;
  #subResources: WebSubResource[] = [];
  constructor(mainResource: WebResource) {
    this.#mainResource = {
      ...mainResource,
      WebResourceFrameName: "",
      WebResourceTextEncodingName: "UTF-8",
    };
  }

  addSubResource(subResource: ResponseData, data: ArrayBuffer) {
    const resource = new KeyedArchive();
    const response = new NSHTTPURLResponse(resource, subResource);
    const ref = resource.addObject(response);
    resource.setTopObject(ref, "WebResourceResponse");
    this.#subResources.push({
      WebResourceMIMEType: subResource.headers["Content-Type"] ?? "",
      WebResourceURL: subResource.url,
      WebResourceData: data,
      WebResourceResponse: resource.encode(),
    });
  }

  encode(): ArrayBuffer {
    return serialize(
      {
        WebMainResource: this.#mainResource,
        WebSubresources: this.#subResources,
      },
      PlistFormat.BINARY
    );
  }
}
