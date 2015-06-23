import { BufferedProcess } from  'atom';

import child_process = require('child_process');
import Q             = require('q');

function grabStdOut(out:string):string{
  console.log("STDOUT: " + out);
  return out;
}

// var readFile = q.node(fs.readFile);
// readFile('test.txt').then(function (data) { });

export function stuff(cmd:string):Promise<string> {
  var exec:any = Q.nfcall(child_process.exec);
  return exec(cmd).then(function (data){
    console.log("result: " + data);
    return data;
  });

  // child_process.exec(cmd, function (err, stdout, stderr){
      // if (err) {
          // console.log("child process failed with code: " + err);
      // }
      // console.log(stdout);
  // });
}
// var p = new BufferedProcess( { command: cmd
                               // , args   : []
                               // , options: grabStdOut
                               // , stdout : grabExit});

  // return "FIXME";
