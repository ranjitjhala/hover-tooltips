/// <reference path="../typings/globals.d.ts" />

// This needs to be filled in
function getInfo(p:Position):string {
  return "I am at line: " + p.line + " column: " + p.column;
}


declare var $;
import boo      = require('atom-space-pen-views');
// import {$} from "atom-space-pen-views";
import path     = require('path');
import emissary = require('emissary');

var Subscriber = emissary.Subscriber;
var TooltipView: { new (rect: any): IToolTipView; } = require('../views/tooltip-view').TooltipView;


interface Position {
  file:string;
  line:number;
  column:number;
}

interface IToolTipView {
    updateText(text: string);

    // Methods from base View
    remove();
}

function attach(editorView: any) {
    // Only on ".ts" files
    var editor   = editorView.editor;
    var filePath = editor.getPath();
    var filename = path.basename(filePath);
    var ext = path.extname(filename);
    if (ext !== '.ts') return;

    var program = lestat.getOrCreateProgram(filePath);

    var scroll = editorView.find('.scroll-view');
    var subscriber = new Subscriber();
    var exprTypeTimeout = null;
    var exprTypeTooltip: IToolTipView = null;
    subscriber.subscribe(scroll, 'mousemove',(e) => {
        clearExprTypeTimeout();
        exprTypeTimeout = setTimeout(() => showExpressionType(e), 100);
    });
    subscriber.subscribe(scroll, 'mouseout',(e) => clearExprTypeTimeout());


    // Setup for clearing
    subscriber.subscribe(editorView, 'editor:will-be-removed',() => deactivate());

    function showExpressionType(e: MouseEvent) {

        // If we are already showing we should wait for that to clear
        if (exprTypeTooltip) return;

        var pixelPt         = pixelPositionFromMouseEvent(editorView, e);
        var screenPt        = editor.screenPositionForPixelPosition(pixelPt);
        var bufferPt        = editor.bufferPositionForScreenPosition(screenPt);
        var curCharPixelPt  = editor.pixelPositionForBufferPosition([bufferPt.row, bufferPt.column]);
        var nextCharPixelPt = editor.pixelPositionForBufferPosition([bufferPt.row, bufferPt.column + 1]);

        if (curCharPixelPt.left >= nextCharPixelPt.left) return;

        // find out show position
        var offset = editorView.lineHeight * 0.7;
        var tooltipRect = { left  : e.clientX
                          , right : e.clientX
                          , top   : e.clientY - offset
                          , bottom: e.clientY + offset };

        exprTypeTooltip = new TooltipView(tooltipRect);

        var pos  = { file   : filePath
                  ,  line   : bufferPt.row
                  ,  column : bufferPt.column };

        var info = getInfo(pos);

        if (!info) {
          hideExpressionType();
        } else {
          var message = "<b>" + info + "</b>" ;
          exprTypeTooltip.updateText(message);
        }

        // Actually make the program manager query
        // ORIG var position = program.languageServiceHost.getIndexFromPosition(filePath, { line: bufferPt.row, ch: bufferPt.column });
        // ORIG var info = program.languageService.getQuickInfoAtPosition(filePath, position);
        // ORIG if (!info) {
        // ORIG hideExpressionType();
        // ORIG } else {
        // ORIG var displayName = ts.displayPartsToString(info.displayParts || []);
        // ORIG var documentation = ts.displayPartsToString(info.documentation || []);
        // ORIG var message = `<b>${displayName}</b>`;
        // ORIG if(documentation) message = message + `<br/><i>${documentation}</i>`;
        // ORIG exprTypeTooltip.updateText(message);
        // ORIG }
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
        if (!exprTypeTooltip) return;
        exprTypeTooltip.remove();
        exprTypeTooltip = null;
    }
}


function pixelPositionFromMouseEvent(editorView, event: MouseEvent) {
    var clientX = event.clientX, clientY = event.clientY;
    var linesClientRect = editorView.find('.lines')[0].getBoundingClientRect();
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

declare var atom: any;

var editorWatch: any; // AtomCore.Disposable;

export function activate() {
  editorWatch = atom.workspace.observeTextEditors((editor:any /* AtomCore.IEditor */) => {
    // subscribe for tooltips
    // inspiration : https://github.com/chaika2013/ide-haskell
    var editorView = $(atom.views.getView(editor));
    attach(editorView);
  });
}

export function deactivate() {
    if (editorWatch) editorWatch.dispose();
}
