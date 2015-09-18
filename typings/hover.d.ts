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
    start   : Position;
    stop    : Position;
    message : string;
  }

  export interface Info {
    valid:boolean;
    info:string;
  }

  export type IProvider = (p:Position, text:string) => Q.Promise<Info>;

  export type Eprovider = (f:string) => Q.Promise<Error[]>;

  export interface Provider {
    command(p:Position):Command;
    result(msg:string[]):string; // should use an option
  }
}
