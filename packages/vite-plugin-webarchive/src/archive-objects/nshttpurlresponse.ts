import { url } from "inspector";
import {
  KeyedArchive,
  ArchiveReference,
  ClassDefinition,
  ClassInstance,
  NULL,
} from "../keyed-archive.js";
import { NSURL } from "./nsurl.js";
import { NSMutableDictionary } from "./nsmutabledictionary.js";

export const NSHTTPURLResponseClassDefinition: ClassDefinition = {
  $classname: "NSHTTPURLResponse",
  $classes: ["NSHTTPURLResponse", "NSURLResponse", "NSObject"],
};

export interface ResponseData {
  url: string;
  statusCode: number;
  headers: Record<string, string>;
}

const RESPONSE_KEY_URL = "__nsurlrequest_proto_prop_obj_0";
const RESPONSE_KEY_STATUS_CODE = "__nsurlrequest_proto_prop_obj_3";
const RESPONSE_KEY_HEADERS = "__nsurlrequest_proto_prop_obj_4";
const RESPONSE_KEY_MIME_TYPE = "__nsurlrequest_proto_prop_obj_6";

export class NSHTTPURLResponse implements ClassInstance {
  $class: ArchiveReference<ClassDefinition>;
  [RESPONSE_KEY_URL]: ArchiveReference<NSURL>;
  [RESPONSE_KEY_STATUS_CODE]: ArchiveReference<number>;
  [RESPONSE_KEY_HEADERS]: ArchiveReference<NSMutableDictionary>;
  [RESPONSE_KEY_MIME_TYPE]: ArchiveReference<string>;

  // not sure what this is, a timestamp maybe? Confusing that it's nsurlrequest though,
  // this is a response!
  __nsurlrequest_proto_prop_obj_1: ArchiveReference<number>;
  __nsurlrequest_proto_prop_obj_2: ArchiveReference<number>;
  __nsurlrequest_proto_prop_obj_5: ArchiveReference<typeof NULL>;

  // these are a mystery
  $0 = 8;
  $1 = 1;
  $2 = 7;
  $3 = 9;
  $4 = false;

  constructor(archive: KeyedArchive, response: ResponseData) {
    this.$class = archive.addObject(NSHTTPURLResponseClassDefinition);
    this[RESPONSE_KEY_STATUS_CODE] = archive.addObject(response.statusCode);

    const nsurl = new NSURL(response.url, archive);
    this[RESPONSE_KEY_URL] = archive.addObject(nsurl);

    const headers = new NSMutableDictionary(archive);
    this[RESPONSE_KEY_HEADERS] = archive.addObject(headers);
    for (const [key, value] of Object.entries(response.headers)) {
      headers.set(key, value);
    }

    this[RESPONSE_KEY_MIME_TYPE] = archive.addObject(
      response.headers["Content-Type"] ?? ""
    );

    this.__nsurlrequest_proto_prop_obj_1 = archive.addObject(779163716.416415);
    this.__nsurlrequest_proto_prop_obj_2 = archive.addObject(0);
    this.__nsurlrequest_proto_prop_obj_5 = archive.addObject(NULL);
  }
}
