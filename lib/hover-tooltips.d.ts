/// <reference path="../typings/hover.d.ts" />
export declare function debug(msg: string): void;
export declare class HoverTooltips {
    private editorWatch;
    provider: Hover.Provider;
    syntax: string;
    activate(): void;
    deactivate(): void;
}
