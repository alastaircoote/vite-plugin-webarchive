import bplistParser from "bplist-parser";
import fs from "fs";

const plist = fs.readFileSync("./test.plist");
const parsed = bplistParser.parseBuffer(plist);
const resp = parsed[0].WebSubresources[0].WebResourceResponse;
const rrr = bplistParser.parseBuffer(resp)[0];

console.log(JSON.stringify(rrr, null, 2));
