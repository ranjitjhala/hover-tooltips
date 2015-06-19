/// <reference path="../typings/globals.d.ts" />
var path = require('path');
var resolve = Promise.resolve.bind(Promise);
exports.dummyProvider = {
    getHoverInfo: function (p) {
        var msg = "I am at file: " + p.file +
            " line: " + p.line +
            " column: " + p.column;
        var res = { valid: true, info: msg };
        return resolve(res);
    },
    isHoverExt: function (filePath) {
        var filename = path.basename(filePath);
        var ext = path.extname(filename);
        return (ext === '.hs' || ext === '.lhs');
    }
};
