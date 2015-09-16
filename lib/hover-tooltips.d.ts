/// <reference path="../typings/hover.d.ts" />
export declare function debug(msg: string): void;
export declare function provider(p: Hover.Provider): Hover.IProvider;
export declare class HoverTooltips {
    private editorWatch;
    provider: Hover.IProvider;
    syntax: string;
    activate(): void;
    deactivate(): void;
}
