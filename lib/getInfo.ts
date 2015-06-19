/// <reference path="../typings/globals.d.ts" />

import path = require('path');

var resolve : typeof Promise.resolve = Promise.resolve.bind(Promise)

export var dummyProvider : Hover.Provider = {
  getHoverInfo : function(p:Hover.Position) : Promise<Hover.Info> {
                    var msg = "I am at file: " + p.file +
                              " line: "        + p.line +
                              " column: "      + p.column;
                    var res = { valid: true, info : msg };
                    return resolve(res);
                  },
  isHoverExt : function(filePath:string):boolean {
                 var filename = path.basename(filePath);
                 var ext      = path.extname(filename);
                 return (ext === '.hs' || ext === '.lhs'); // for .haskell files
               }
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
