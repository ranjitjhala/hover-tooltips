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

  export interface Provider {
    isHoverExt(filePath:string):boolean;
    getHoverInfo(p:Hover.Position):Promise<Hover.Info>;
  }
}
