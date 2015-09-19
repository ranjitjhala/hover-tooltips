/// <reference path="../typings/hover.d.ts" />

import path          = require('path');
import child_process = require('child_process');
import Q             = require('q');
import {BufferedProcess} from 'atom';

export function provider(p:Hover.Provider):Hover.IProvider {

  function okInfo(text:string[]):Hover.Info {
    var ty = p.result(text);
    if (ty){
      // console.log("OK Info: " + ty);
      return { valid: true, info: ty};
    }
    return { valid: false, info: text.join('\n') };
  }

  function errInfo(text:string):Hover.Info {
    // console.log("ERROR Info: " + text);
    atom.confirm({
      message: "Hover Info Error" + text,
      detailedMessage: text,
      buttons: {
        Close: function (){ window.alert('ok'); }
      }
    });
    return { valid: false, info: text };
  }

  function execPromise(cmd:Hover.Command):Q.Promise<string[]> {
    var cmd_  = cmd.cmd + ' ' + cmd.args.join(' ');
    var r:any = Q.nfcall(child_process.exec, cmd_);
    return r;
  }

  function dummyInfo2(pos:Hover.Position) : Q.Promise<Hover.Info> {
    var cmd = p.command(pos);
    return execPromise(cmd)
             .then(okInfo)
             .catch(errInfo)
             ;
  }

  return dummyInfo2;
}
