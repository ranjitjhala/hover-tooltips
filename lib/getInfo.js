/// <reference path="../typings/globals.d.ts" />
var path = require('path');
var child_process = require('child_process');
var Q = require('q');
function grabStdOut(out) {
    console.log("STDOUT: " + out);
    return out;
}
function stuff(cmd) {
    return Q.nfcall(child_process.exec, cmd)
        .then(function (text) {
        console.log("result: " + text);
        return text;
    });
}
var resolve = Promise.resolve.bind(Promise);
function dummyInfo1(p) {
    var msg = "I am at file: " + p.file +
        " line: " + p.line +
        " column: " + p.column;
    var res = { valid: true, info: msg };
    return resolve(res);
}
function dummyInfo2(p) {
    return stuff('ls').then(function (msg) {
        return { valid: true, info: msg };
    });
}
function isHaskell(filePath) {
    var filename = path.basename(filePath);
    var ext = path.extname(filename);
    return (ext === '.hs' || ext === '.lhs');
}
exports.dummyProvider = {
    getHoverInfo: dummyInfo2,
    isHoverExt: isHaskell
};
