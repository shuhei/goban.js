import Controller from 'controller';
import CanvasView from 'canvas-view';
import ControlView from 'control-view';
import Board from 'board';

var canvasView = new CanvasView(document.getElementById('goban'));
var controlView = new ControlView(document.getElementById('control'));
var board = new Board();

var controller = new Controller(canvasView, controlView, board);
