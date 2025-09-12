import {
  KeyedArchive,
  ArchiveReference,
  ClassDefinition,
  ClassInstance,
} from "../keyed-archive.js";

const NSMutableDictionaryClassDefinition: ClassDefinition = {
  $classname: "NSMutableDictionary",
  $classes: ["NSMutableDictionary", "NSDictionary", "NSObject"],
};

export class NSMutableDictionary implements ClassInstance {
  ["$class"]: ArchiveReference<typeof NSMutableDictionaryClassDefinition>;
  ["NS.keys"]: ArchiveReference<string>[] = [];
  ["NS.objects"]: ArchiveReference<string>[] = [];

  #archive: KeyedArchive;

  constructor(archive: KeyedArchive) {
    this["$class"] = archive.addObject(NSMutableDictionaryClassDefinition);
    this.#archive = archive;
  }

  set(key: string, value: string) {
    this["NS.keys"].push(this.#archive.addObject(key));
    this["NS.objects"].push(this.#archive.addObject(value));
  }
}
