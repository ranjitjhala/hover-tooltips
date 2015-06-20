/// <reference path="../typings/globals.d.ts" />

import path          = require('path');
import child_process = require('child_process');
import Q             = require('q');

function grabStdOut(out:string):string{
  console.log("STDOUT: " + out);
  return out;
}

// var readFile = q.node(fs.readFile);
// readFile('test.txt').then(function (data) { });

function stuff(cmd:string):Promise<string> {
  return Q.nfcall(child_process.exec, cmd)
          .then(function (text) {
            console.log("result: " + text);
            return text;
           });

  // child_process.exec(cmd, function (err, stdout, stderr){
      // if (err) {
          // console.log("child process failed with code: " + err);
      // }
      // console.log(stdout);
  // });
}
// import { BufferedProcess } from  'atom';
// var p = new BufferedProcess( { command: cmd
                               // , args   : []
                               // , options: grabStdOut
                               // , stdout : grabExit});

// return "FIXME";

var resolve : typeof Promise.resolve = Promise.resolve.bind(Promise)

function dummyInfo1(p:Hover.Position) : Promise<Hover.Info> {
  var msg = "I am at file: " + p.file +
            " line: "        + p.line +
            " column: "      + p.column;
  var res = { valid: true, info : msg };
  return resolve(res);
}


function dummyInfo2(p:Hover.Position) : Promise<Hover.Info> {
  return stuff('ls').then(function (msg) {
    return {valid:true, info:msg}
  });
}


function isHaskell(filePath:string):boolean {
  var filename = path.basename(filePath);
  var ext      = path.extname(filename);
  return (ext === '.hs' || ext === '.lhs'); // for .haskell files
}

export var dummyProvider : Hover.Provider = {
  getHoverInfo: dummyInfo2,
  isHoverExt: isHaskell
}

// import { BufferedProcess } from "atom";
// var pp = new BufferedProcess('cat');

/*
export function quickInfo(query: QuickInfoQuery): Promise<QuickInfoResponse> {
    consistentPath(query);
    var project = getOrCreateProject(query.filePath);
    var info = project.languageService.getQuickInfoAtPosition(query.filePath, query.position);
    if (!info) return Promise.resolve({ valid: false });
    else return resolve({
        valid: true,
        name: ts.displayPartsToString(info.displayParts || []),
        comment: ts.displayPartsToString(info.documentation || []),
    });
}
*/
