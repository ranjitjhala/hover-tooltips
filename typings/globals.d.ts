/// <reference path="tsd.d.ts" />


declare module Hover {

  export interface Position {
    file:string;
    line:number;
    column:number;
  }

  export interface Info {
    valid:boolean;
    info:string;
  }

}

// export declare function getInfo(p:Hover.Position) : Hover.Info;
