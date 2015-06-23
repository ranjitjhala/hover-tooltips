/// <reference path="../typings/hover.d.ts" />
var atom_space_pen_views_1 = require("atom-space-pen-views");
var emissary = require('emissary');
var fs = require('fs');
var tooltipView = require('./tooltipView');
var TooltipView = tooltipView.TooltipView;
var Info = require('./info');
var Subscriber = emissary.Subscriber;
function debug(msg) {
    if (false) {
        console.log("HOVER-TOOLTIPS: " + msg);
    }
}
exports.debug = debug;
function getFromShadowDom(element, selector) {
    var el = element[0];
    var found = el.rootElement.querySelectorAll(selector);
    return atom_space_pen_views_1.$(found[0]);
}
function mkAttach(iprovider) {
    return function attach(editorView, editor) {
        var rawView = editorView[0];
        var filePath = editor.getPath();
        var projectDir = atom.project.relativize(filePath);
        if (!fs.existsSync(filePath))
            return;
        var scroll = getFromShadowDom(editorView, '.scroll-view');
        var subscriber = new Subscriber();
        var exprTypeTimeout = null;
        var exprTypeTooltip = null;
        var lastExprTypeBufferPt;
        subscriber.subscribe(scroll, 'mousemove', function (e) {
            var pixelPt = pixelPositionFromMouseEvent(editorView, e);
            var screenPt = editor.screenPositionForPixelPosition(pixelPt);
            var bufferPt = editor.bufferPositionForScreenPosition(screenPt);
            if (lastExprTypeBufferPt && lastExprTypeBufferPt.isEqual(bufferPt) && exprTypeTooltip)
                return;
            lastExprTypeBufferPt = bufferPt;
            clearExprTypeTimeout();
            exprTypeTimeout = setTimeout(function () { return showExpressionType(e); }, 100);
        });
        subscriber.subscribe(scroll, 'mouseout', function (e) { return clearExprTypeTimeout(); });
        subscriber.subscribe(scroll, 'keydown', function (e) { return clearExprTypeTimeout(); });
        atom.commands.add('atom-text-editor', 'editor:will-be-removed', function (e) {
            if (e.currentTarget == editorView[0]) {
                deactivate();
            }
        });
        function showExpressionType(e) {
            if (exprTypeTooltip)
                return;
            var pixelPt = pixelPositionFromMouseEvent(editorView, e);
            pixelPt.top += editor.displayBuffer.getScrollTop();
            pixelPt.left += editor.displayBuffer.getScrollLeft();
            var screenPt = editor.screenPositionForPixelPosition(pixelPt);
            var bufferPt = editor.bufferPositionForScreenPosition(screenPt);
            var curCharPixelPt = rawView.pixelPositionForBufferPosition([bufferPt.row, bufferPt.column]);
            var nextCharPixelPt = rawView.pixelPositionForBufferPosition([bufferPt.row, bufferPt.column + 1]);
            if (curCharPixelPt.left >= nextCharPixelPt.left)
                return;
            var offset = editor.getLineHeightInPixels() * 0.7;
            var tooltipRect = {
                left: e.clientX,
                right: e.clientX,
                top: e.clientY - offset,
                bottom: e.clientY + offset
            };
            exprTypeTooltip = new TooltipView(tooltipRect);
            var position = getEditorPositionForBufferPosition(editor, bufferPt);
            var pos = { file: filePath,
                line: 1 + bufferPt.row,
                column: 1 + bufferPt.column };
            iprovider(pos).then(function (resp) {
                if (!resp.valid) {
                    hideExpressionType();
                }
                else {
                    var msg = resp.info;
                    msg = "<b>" + msg + "</b>";
                    if (exprTypeTooltip) {
                        exprTypeTooltip.updateText(msg);
                    }
                }
            });
        }
        function deactivate() {
            subscriber.unsubscribe();
            clearExprTypeTimeout();
        }
        function clearExprTypeTimeout() {
            if (exprTypeTimeout) {
                clearTimeout(exprTypeTimeout);
                exprTypeTimeout = null;
            }
            hideExpressionType();
        }
        function hideExpressionType() {
            if (!exprTypeTooltip)
                return;
            exprTypeTooltip.$.remove();
            exprTypeTooltip = null;
        }
    };
}
function getEditorPosition(editor) {
    var bufferPos = editor.getCursorBufferPosition();
    return getEditorPositionForBufferPosition(editor, bufferPos);
}
function getEditorPositionForBufferPosition(editor, bufferPos) {
    var buffer = editor.getBuffer();
    return buffer.characterIndexForPosition(bufferPos);
}
function pixelPositionFromMouseEvent(editorView, event) {
    var clientX = event.clientX, clientY = event.clientY;
    var linesClientRect = getFromShadowDom(editorView, '.lines')[0].getBoundingClientRect();
    var top = clientY - linesClientRect.top;
    var left = clientX - linesClientRect.left;
    return { top: top, left: left };
}
function screenPositionFromMouseEvent(editorView, event) {
    return editorView.getModel().screenPositionForPixelPosition(pixelPositionFromMouseEvent(editorView, event));
}
var HoverTooltips = (function () {
    function HoverTooltips() {
    }
    HoverTooltips.prototype.activate = function () {
        var _this = this;
        this.editorWatch = atom.workspace.observeTextEditors(function (editor) {
            var editorView = atom_space_pen_views_1.$(atom.views.getView(editor));
            var iprovider = Info.provider(_this.provider);
            var attach = mkAttach(iprovider);
            attach(editorView, editor);
        });
    };
    HoverTooltips.prototype.deactivate = function () {
        if (this.editorWatch) {
            this.editorWatch.dispose();
        }
    };
    return HoverTooltips;
})();
exports.HoverTooltips = HoverTooltips;
