//import { parse as _parse } from "./dist/index.js";
import { parse as _parse } from "./bundle.js";

export class HTMLParser {
  static parse(data, opitions = {}) {
    return _parse(data, opitions);
  }
}
