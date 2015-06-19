/// <reference path="../typings/globals.d.ts" />
var path = require('path');
var resolve = Promise.resolve.bind(Promise);
function getHoverInfo(p) {
    var msg = "I am at file: " + p.file +
        " line: " + p.line +
        " column: " + p.column;
    var res = { valid: true, info: msg };
    return resolve(res);
}
exports.getHoverInfo = getHoverInfo;
function isHoverExt(filePath) {
    var filename = path.basename(filePath);
    var ext = path.extname(filename);
    return (ext === '.hs' || ext === '.lhs');
}
exports.isHoverExt = isHoverExt;
