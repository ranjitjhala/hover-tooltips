/// <reference path="tsd.d.ts" />

declare module Hover {

  export interface Command {
    cmd:string;
    args:string[];
    // opts:{cwd:string};
  }

  export interface Position {
    file:string;
    line:number;
    column:number;
  }

  export interface Info {
    valid:boolean;
    info:string;
  }

  export type IProvider = (p:Hover.Position) => Q.Promise<Hover.Info>;

  export interface Provider {
    command(p:Hover.Position):Hover.Command;
    result(msg:string[]):string; // should use an option
  }
}
