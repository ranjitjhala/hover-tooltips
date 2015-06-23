/// <reference path="../typings/hover.d.ts" />

/*****************************************************************/
/*****************************************************************/
/*****************************************************************/

import { $ }         from "atom-space-pen-views";
import emissary    = require('emissary');
import fs          = require('fs');
import tooltipView = require('./tooltipView');
import TooltipView = tooltipView.TooltipView;
import Info        = require('./info');

var Subscriber = emissary.Subscriber;

export function debug(msg:string){
  if (false){
    console.log("HOVER-TOOLTIPS: " + msg);
  }
}
function getFromShadowDom(element: any, selector: string): any {
  var el = element[0];
  var found = (<any> el).rootElement.querySelectorAll(selector);
  return $(found[0]);
}

function mkAttach(iprovider:Hover.IProvider) {

return function attach(editorView : JQuery, editor: AtomCore.IEditor){
    var rawView: any = editorView[0];

    // Only on ".ts" files
    var filePath = editor.getPath();
    var projectDir = atom.project.relativize(filePath); //[0];
    // debug("HOVER-TOOLTIPS-ATTACH: " + projectDir);
    // if (!provider.isHoverExt(filePath)) return;

    // We only create a "program" once the file is persisted to disk
    if (!fs.existsSync(filePath)) return;

    var scroll = getFromShadowDom(editorView, '.scroll-view');
    var subscriber = new Subscriber();
    var exprTypeTimeout = null;
    var exprTypeTooltip: TooltipView = null;

    // to debounce mousemove event's firing for some reason on some machines
    var lastExprTypeBufferPt: any;

    subscriber.subscribe(scroll, 'mousemove', (e) => {
        var pixelPt = pixelPositionFromMouseEvent(editorView, e)
        var screenPt = editor.screenPositionForPixelPosition(pixelPt)
        var bufferPt = editor.bufferPositionForScreenPosition(screenPt)
        if (lastExprTypeBufferPt && lastExprTypeBufferPt.isEqual(bufferPt) && exprTypeTooltip)
            return;

        lastExprTypeBufferPt = bufferPt;

        clearExprTypeTimeout();
        exprTypeTimeout = setTimeout(() => showExpressionType(e), 100);
    });
    subscriber.subscribe(scroll, 'mouseout', (e) => clearExprTypeTimeout());
    subscriber.subscribe(scroll, 'keydown', (e) => clearExprTypeTimeout());

    // Setup for clearing
    atom.commands.add('atom-text-editor', 'editor:will-be-removed', (e) => {
        if (e.currentTarget == editorView[0]) {
            deactivate();
        }
    });


    function showExpressionType(e: MouseEvent) {

        // If we are already showing we should wait for that to clear
        if (exprTypeTooltip) return;

        var pixelPt = pixelPositionFromMouseEvent(editorView, e);
        pixelPt.top += editor.displayBuffer.getScrollTop();
        pixelPt.left += editor.displayBuffer.getScrollLeft();
        var screenPt = editor.screenPositionForPixelPosition(pixelPt);
        var bufferPt = editor.bufferPositionForScreenPosition(screenPt);
        var curCharPixelPt = rawView.pixelPositionForBufferPosition([bufferPt.row, bufferPt.column]);
        var nextCharPixelPt = rawView.pixelPositionForBufferPosition([bufferPt.row, bufferPt.column + 1]);

        if (curCharPixelPt.left >= nextCharPixelPt.left) return;

        // find out show position
        var offset = (<any>editor).getLineHeightInPixels() * 0.7;
        var tooltipRect = {
            left: e.clientX,
            right: e.clientX,
            top: e.clientY - offset,
            bottom: e.clientY + offset
        };
        exprTypeTooltip = new TooltipView(tooltipRect);

        var position = getEditorPositionForBufferPosition(editor, bufferPt);

        var pos  = { file   : filePath
                  ,  line   : 1 + bufferPt.row
                  ,  column : 1 + bufferPt.column };

        // Actually make the program manager query
        iprovider(pos).then((resp) => {
          if (!resp.valid) {
            hideExpressionType();
          } else {
            var msg = resp.info; // .replace(/\n/g, "<br>");
            msg = `<b>${msg}</b>`;
            // debug("TOOLTIP: " + msg);
            // Sorry about this "if". It's in the code I copied so I guess its there for a reason
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

    /** clears the timeout && the tooltip */
    function clearExprTypeTimeout() {
        if (exprTypeTimeout) {
            clearTimeout(exprTypeTimeout);
            exprTypeTimeout = null;
        }
        hideExpressionType();
    }
    function hideExpressionType() {
        if (!exprTypeTooltip) return;
        exprTypeTooltip.$.remove();
        exprTypeTooltip = null;
    }
}
}


// Optimized version where we do not ask this of the languageServiceHost
function getEditorPosition(editor: AtomCore.IEditor): number {
    var bufferPos = editor.getCursorBufferPosition();
    return getEditorPositionForBufferPosition(editor, bufferPos);
}

// Further optimized if you already have the bufferPos
function getEditorPositionForBufferPosition(editor: AtomCore.IEditor, bufferPos: any /* TextBuffer.IPoint */): number {
    var buffer = editor.getBuffer();
    return buffer.characterIndexForPosition(bufferPos);
}

function pixelPositionFromMouseEvent(editorView, event: MouseEvent) {
    var clientX = event.clientX, clientY = event.clientY;
    var linesClientRect = getFromShadowDom(editorView, '.lines')[0].getBoundingClientRect();
    var top = clientY - linesClientRect.top;
    var left = clientX - linesClientRect.left;
    return { top: top, left: left };
}

function screenPositionFromMouseEvent(editorView, event) {
    return editorView.getModel().screenPositionForPixelPosition(pixelPositionFromMouseEvent(editorView, event));
}

/*************************************************************************/
/* Top-level hook into ATOM                                              */
/*************************************************************************/

export class HoverTooltips {

  private editorWatch: AtomCore.Disposable;

  provider:Hover.Provider;

  syntax:string;

  activate() {
    this.editorWatch = atom.workspace.observeTextEditors((editor:AtomCore.IEditor) => {
      var editorView = $(atom.views.getView(editor));
      var iprovider  = Info.provider(this.provider);
      var attach = mkAttach(iprovider);
      attach(editorView, editor);
    });
  }

  deactivate() {
    if (this.editorWatch) {
      this.editorWatch.dispose();
    }
  }
}
