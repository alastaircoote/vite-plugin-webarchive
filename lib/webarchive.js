import { serialize } from "@plist/plist";
import { PlistFormat } from "@plist/common";
export class WebArchive {
    #mainResource;
    constructor(mainResource) {
        this.#mainResource = {
            ...mainResource,
            WebResourceFrameName: "",
            WebResourceTextEncodingName: "UTF-8",
        };
    }
    encode() {
        return serialize({
            WebMainResource: this.#mainResource,
            WebSubresources: [],
        }, PlistFormat.BINARY);
    }
}
