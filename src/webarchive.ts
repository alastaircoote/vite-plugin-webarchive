import { serialize } from "@plist/plist";
import { Dictionary, PlistFormat } from "@plist/common";

interface WebResource extends Dictionary {
  WebResourceMIMEType: string;
  WebResourceURL: string;
  WebResourceData: ArrayBuffer;
}

interface MainWebResource extends WebResource {
  WebResourceFrameName: "";
  WebResourceTextEncodingName: "UTF-8";
}

export class WebArchive {
  #mainResource: MainWebResource;
  constructor(mainResource: WebResource) {
    this.#mainResource = {
      ...mainResource,
      WebResourceFrameName: "",
      WebResourceTextEncodingName: "UTF-8",
    };
  }

  encode(): ArrayBuffer {
    return serialize(
      {
        WebMainResource: this.#mainResource,
        WebSubresources: [],
      },
      PlistFormat.BINARY
    );
  }
}
