import { serialize } from "@plist/plist";
import { Dictionary, PlistFormat } from "@plist/common";

export const NULL = "$null";

type ObjectEntry =
  | typeof NULL
  | ClassDefinition
  | string
  | ClassInstance
  | number;

export type ArchiveReference<T> = {
  CF$UID: number;
};

export interface ClassDefinition {
  $classname: string;
  $classes: string[];
}

export interface ClassInstance {
  $class: ArchiveReference<ClassDefinition>;
}

export class KeyedArchive {
  $objects: ObjectEntry[] = [];
  $top: Record<string, ArchiveReference<ObjectEntry>> = {};
  $archiver = "NSKeyedArchiver";
  $version = 100000;

  constructor() {
    // decoding seems to fail if the first object isn't null, so let's insert it
    // now to make sure it's always at index #0
    this.addObject(NULL);
  }

  setTopObject(objRef: ArchiveReference<ObjectEntry>, topName: string) {
    this.$top[topName] = objRef;
  }

  addObject<T extends ObjectEntry>(obj: T): ArchiveReference<T> {
    const existing = this.$objects.indexOf(obj);
    if (existing !== -1) {
      return { CF$UID: existing };
    }
    this.$objects.push(obj);
    return { CF$UID: this.$objects.length - 1 };
  }

  encode(): ArrayBuffer {
    const serialized = serialize(
      this as unknown as Dictionary,
      PlistFormat.BINARY
    );

    return serialized;
  }
}
