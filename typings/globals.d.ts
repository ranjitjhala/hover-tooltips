/// <reference path="tsd.d.ts" />

/// declare module "lestat" {
  /// export interface ProgramManager {
    /// getInfo(file:string, line:number, column:number):string;
  /// }
/// }


declare module 'atom-space-pen-views' {
    // RJ import atom = require('atom');
    // RJ export class SelectListView extends atom.SelectListView { }
    // RJ export class ScrollView extends atom.ScrollView { }
    // RJ export class View extends atom.View { }
    export var $: any; // RJ: JQueryStatic;
}


declare var lestat: any;

declare module "lestat" {
  export = lestat;
}
