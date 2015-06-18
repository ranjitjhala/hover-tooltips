/// <reference path="../typings/globals.d.ts" />
var path = require('path');
function getHoverInfo(p) {
    return { valid: true,
        info: "I am at file: " + p.file + " line: " + p.line + " column: " + p.column
    };
}
exports.getHoverInfo = getHoverInfo;
function isHoverExt(filePath) {
    var filename = path.basename(filePath);
    var ext = path.extname(filename);
    return (ext === '.ts');
}
exports.isHoverExt = isHoverExt;
