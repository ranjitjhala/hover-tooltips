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

  export interface Error {
    file:string;
    start:Position;
    end:Position;
  }

  export interface Info {
    valid:boolean;
    info:string;
  }

  export type IProvider = (p:Position) => Q.Promise<Info>;

  export type Eprovider = (f:string) => Q.Promise<Error[]>;

  export interface Provider {
    command(p:Position):Command;
    result(msg:string[]):string; // should use an option
  }
}
