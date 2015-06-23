// <reference path="../typings/globals.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var hover_tooltips_1 = require('./hover-tooltips');
function hdevtoolsResult(msg) {
    try {
        hover_tooltips_1.debug("PARSE (text): " + msg + "\nJSON: " + JSON.stringify(msg));
        var ls = msg[0].split('\n');
        hover_tooltips_1.debug("PARSE (ls): " + ls);
        var l0 = ls[0];
        hover_tooltips_1.debug("PARSE (l0): " + l0);
        var ty = l0.match(/\".*\"/i);
        hover_tooltips_1.debug("PARSE (ty): " + ty);
        var n = ty[0].length;
        var res = ty[0].substring(1, n - 1);
        hover_tooltips_1.debug("PARSE (res): " + res);
        return res;
    }
    catch (e) {
        hover_tooltips_1.debug("PARSE ERROR: " + e.toString());
        return null;
    }
}
function hdevtoolsCommand(p) {
    var execP = atom.config.get('hover-tooltips.executablePath');
    var socketP = atom.config.get('hover-tooltips.socketPath');
    return { cmd: execP,
        args: ['type',
            '-s', socketP,
            ("" + p.file), ("" + p.line), ("" + p.column)
        ]
    };
}
var HdevtoolsTooltips = (function (_super) {
    __extends(HdevtoolsTooltips, _super);
    function HdevtoolsTooltips() {
        _super.apply(this, arguments);
        this.provider = { result: hdevtoolsResult,
            command: hdevtoolsCommand
        };
        this.syntax = 'source.haskell';
        this.config = { executablePath: { type: 'string',
                default: 'hdevtools' },
            socketPath: { type: 'string',
                default: '~/.hdevtools-socket-atom' }
        };
    }
    return HdevtoolsTooltips;
})(hover_tooltips_1.HoverTooltips);
exports.HdevtoolsTooltips = HdevtoolsTooltips;
module.exports = new HdevtoolsTooltips();
