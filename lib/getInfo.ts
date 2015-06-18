
/// <reference path="../typings/globals.d.ts" />

import path        = require('path');

// This needs to be filled in
export function getHoverInfo(p:Hover.Position) : Hover.Info {
  return { valid: true
         , info : "I am at file: " + p.file + " line: " + p.line + " column: " + p.column
         }
}

export function isHoverExt(filePath:string):boolean {
  var filename = path.basename(filePath);
  var ext = path.extname(filename);
  return (ext === '.ts'); // for .ts files
}
