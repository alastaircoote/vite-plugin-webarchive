import {
  KeyedArchive,
  ArchiveReference,
  ClassDefinition,
  ClassInstance,
  NULL,
} from "../keyed-archive.js";

const NSURLClassDefinition: ClassDefinition = {
  $classname: "NSURL",
  $classes: ["NSURL", "NSObject"],
};

export class NSURL implements ClassInstance {
  ["NS.Base"]: ArchiveReference<typeof NULL>;
  ["$class"]: ArchiveReference<typeof NSURLClassDefinition>;
  ["NS.relative"]: ArchiveReference<string>;

  constructor(absoluteUrl: string, archive: KeyedArchive) {
    /**
     * Pretty sure we could use NS.Base to support relative URLs here
     * but we don't actually have any need to, so we won't.
     */
    this["NS.Base"] = archive.addObject(NULL);
    this["$class"] = archive.addObject(NSURLClassDefinition);
    this["NS.relative"] = archive.addObject(absoluteUrl);
  }
}
