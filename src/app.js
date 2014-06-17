import Controller from 'controller';
import CanvasView from 'canvas-view';
import Board from 'board';
import { $, bind } from 'utils';

var canvas = window.document.getElementById('goban');

var view = new CanvasView(canvas);
var board = new Board();

var controller = new Controller(view, board);

// TODO: Define ControlView and emit events from it.
$("previous").onclick = bind(controller, controller.onPrevious);
$("next").onclick = bind(controller, controller.onNext);
$("beginning").onclick = bind(controller, controller.onBeginning);
$("last").onclick = bind(controller, controller.onLast);
