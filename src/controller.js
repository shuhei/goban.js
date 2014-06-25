import { EMPTY, BLACK, WHITE, BORDER, CHECKED } from './constants';
import { $, bind } from './utils';

export default class Controller {
  constructor(view, control, board) {
    this.view = view;
    this.control = control;
    this.board = board;
    this.history = [];
    this.current = -1;

    // TODO: Use event.
    this.view.onClick = bind(this, this.onViewClick);

    this.control.addEventListener('previous', bind(this, this.onPrevious));
    this.control.addEventListener('next', bind(this, this.onNext));
    this.control.addEventListener('beginning', bind(this, this.onBeginning));
    this.control.addEventListener('last', bind(this, this.onLast));
  }

  onViewClick(p) {
    console.log(p);
    var result = this.board.put(p);
    if (result) {
      this._putAndRemove(result.move, result.prisoners);
      // record
      // remove old moves and add move
      while (this.current < this.history.length - 1) {
        this.history.pop();
      }
      // add new move
      this.current ++;
      this.history.push(result);
      // update view
      this._updateControl();
    }
  }

  onPrevious() {
    // if no more previous move, do nothing
    if (this.current < 0) return;
    
    var previous = this.history[this.current];
    // TODO: refactor
    // Modify view
    this.view.removeStone(previous.move.x, previous.move.y);
    // redraw prisoners
    for (var i = 0; i < previous.prisoners.length; i++) {
      var p = previous.prisoners[i];
      if (this.board.color === BLACK) {
        this.view.drawBlack(p.x, p.y);
      } else {
        this.view.drawWhite(p.x, p.y);
      }
    }
    // Modify model
    this.current --;
    this.board.back(previous.move, previous.prisoners);
    // update control
    this._updateControl();
  }

  onNext() {
    if (this.history.length <= this.current + 1) return;

    var next = this.history[this.current + 1];
    var result = this.board.put(next.move);
    if (result) {
      // TODO: make sure to remove stones!
      this._putAndRemove(result.move, result.prisoners);
      // record
      this.current ++;
      // update view
      this._updateControl();
    }
  }

  onBeginning() {
    while (this.current >= 0) {
      this.onPrevious();
    }
  }

  onLast() {
    while (this.current <= this.history.length - 2) {
      this.onNext();
    }
  }

  //
  // private methods
  //
  _updateControl() {
    this.control.currentCount = this.current + 1;
    this.control.blackPrisoner = this.board.prisoners[BLACK];
    this.control.whitePrisoner = this.board.prisoners[WHITE];
  }

  _putAndRemove(stone, prisoners) {
    // draw stone
    if (this.board.color === WHITE) {
      this.view.drawBlack(stone.x, stone.y);  // VIEW
    } else {
      this.view.drawWhite(stone.x, stone.y);  // VIEW
    }
    // remove stones
    for (var i = 0; i < prisoners.length; i++) {
      var prisoner = prisoners[i];
      this.view.removeStone(prisoner.x, prisoner.y);  // VIEW
    }
  }
}
