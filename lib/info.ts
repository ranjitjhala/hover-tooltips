/// <reference path="../typings/globals.d.ts" />

import path          = require('path');
import child_process = require('child_process');
import Q             = require('q');
import {BufferedProcess} from 'atom';

export function provider(p:Hover.Provider):Hover.IProvider {

  function okInfo(text:string[]):Hover.Info {
    var ty = p.result(text);
    if (ty){
      console.log("OK Info: " + ty);
      return { valid: true, info: ty};
    }
    return { valid: false, info: text.join('\n') };
  }

  function errInfo(text:string):Hover.Info {
    console.log("ERROR Info: " + text);
    atom.confirm({
      message: "Hover Info Error" + text,
      detailedMessage: text,
      buttons: {
        Close: function (){ window.alert('ok'); }
      }
    });
    return { valid: false, info: text };
  }

  function execPromise(cmd:Hover.Command):Promise<string[]> {
    var cmd_ = cmd.cmd + ' ' + cmd.args.join(' ');
    return Q.nfcall(child_process.exec, cmd_);
  }

  function dummyInfo2(pos:Hover.Position) : Promise<Hover.Info> {
    var cmd = p.command(pos);
    return execPromise(cmd)
             .then(okInfo)
             .catch(errInfo)
             ;
  }

  return dummyInfo2;
}

/////////////////////////////////////////////////////////////////////

/*
function dummyInfo1(p:Hover.Position) : Promise<Hover.Info> {
  var msg = "I am at file: " + p.file +
            " line: "        + p.line +
            " column: "      + p.column;
  var resolve : typeof Promise.resolve = Promise.resolve.bind(Promise)
  var res = { valid: true, info : msg };
  return resolve(res);
}

// PARAM
// function isHoverExt(filePath:string):boolean {
  // var filename = path.basename(filePath);
  // var ext      = path.extname(filename);
  // return (ext === '.hs' || ext === '.lhs'); // for .haskell files
// }

function dummyInfo3(p:Hover.Position):Promise<Hover.Info> {
  var cmd = getInfoCommand(p);

  return new Promise(function(okF, errF){
    new BufferedProcess({
      command : cmd.cmd,
      args    : cmd.args,
      options : cmd.opts,
      stderr  : function(msg:string[]){
                  console.log('OUTPUT: ' + msg);
                  okF(okInfo(msg));
                },
      exit    : function(code) {
                  console.log('EXIT CODE: ' + code);
                }
    })// .onWillThrowError(errF);
  })
}
*/
