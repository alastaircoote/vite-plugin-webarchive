import { Dictionary } from "@plist/common";
interface WebResource extends Dictionary {
    WebResourceMIMEType: string;
    WebResourceURL: string;
    WebResourceData: ArrayBuffer;
}
export declare class WebArchive {
    #private;
    constructor(mainResource: WebResource);
    encode(): ArrayBuffer;
}
export {};
