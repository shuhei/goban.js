/**
 @namespace GOBAN
 */
var GOBAN = GOBAN || {};

// constants
var EMPTY = 0;
var BLACK = 1;
var WHITE = 2;
var BORDER = 3;
var CHECKED = 4;

/*
 Utilities
 */
GOBAN.Utils = {
  $: function(id) {
    return document.getElementById(id);
  },
  bind: function(scope, fn) {
    return function() {
      return fn.apply(scope, arguments);
    }
  }
};

/**
 @namespace GOBAN
 @class Point
 */
GOBAN.Point = function() {
  this.initialize.apply(this, arguments);
}
GOBAN.Point.prototype = {
  initialize: function(x, y) {
    this.x = x;
    this.y = y;
  },
  equals: function(p) {
    return typeof p === "object" && this.x === p.x && this.y === p.y;
  }
}
/**
 @namespace GOBAN
 @class View
 */
GOBAN.CanvasView = function() {
  this.initialize.apply(this, arguments);
}
GOBAN.CanvasView.prototype = {
  // Constructor
  initialize: function(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    
    this.rows = 19;
    this.unit = 21;
    this.margin = 0.7;
    this.width = this.unit * (this.rows - 1 + this.margin * 2);
    
    this.stars = {19: [
      new GOBAN.Point( 4, 4), new GOBAN.Point( 4, 10), new GOBAN.Point( 4, 16),
      new GOBAN.Point(10, 4), new GOBAN.Point(10, 10), new GOBAN.Point(10, 16),
      new GOBAN.Point(16, 4), new GOBAN.Point(16, 10), new GOBAN.Point(16, 16)
    ]};
    
    this._drawBoard();
    
    this.canvas.addEventListener("click", GOBAN.Utils.bind(this, this._onCanvasClick), false);
  },
  // Draw stones
  drawBlack: function(x, y) {
    this._drawStone(x, y, "#000000");
  },
  drawWhite: function(x, y) {
    this._drawStone(x, y, "#FFFFFF");
  },
  removeStone: function(x, y) {
    var cs = this._pointToCoords(x, y);
    this.ctx.fillStyle = '#EECC66';
    // redraw background
    this.ctx.fillRect(cs.x - this.unit * 0.5, cs.y - this.unit * 0.5,
      this.unit, this.unit);
    // redraw lines
    this.ctx.beginPath();
    if (x > 1) {
      this.ctx.moveTo(cs.x - this.unit * 0.5, cs.y);
      this.ctx.lineTo(cs.x, cs.y);
    }
    if (x < this.rows) {
      this.ctx.moveTo(cs.x, cs.y);
      this.ctx.lineTo(cs.x + this.unit * 0.5, cs.y);
    }
    if (y > 1) {
      this.ctx.moveTo(cs.x, cs.y - this.unit * 0.5);
      this.ctx.lineTo(cs.x, cs.y);
    }
    if (y < this.rows) {
      this.ctx.moveTo(cs.x, cs.y);
      this.ctx.lineTo(cs.x, cs.y + this.unit * 0.5);
    }
    this.ctx.stroke();
    // redraw star
    var stars = this.stars[this.rows];
    for (var i = 0; i < stars.length; i ++) {
      var star = stars[i];
      if (star.x === x && star.y === y) this._drawStar(star);
    }
  },
  // Utility functions
  _onCanvasClick: function(e) {
    //alert(this.width);
    var x = e.pageX - this.canvas.offsetLeft;
    var y = e.pageY - this.canvas.offsetTop;
    var p = this._coordsToPoint(x, y);
    if (this.onClick) {
      this.onClick(p);
    }
  },
  _drawStone: function(x, y, color) {
    var p = this._pointToCoords(x, y);
    this.ctx.fillStyle = color;
    //this.ctx.strokeStyle = "#333333";
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, this.unit * 0.5 - 1.0, 0, Math.PI * 2, true);
    this.ctx.fill();
    this.ctx.stroke();
  },
  _pointToCoords: function(x, y) {
    return new GOBAN.Point(
      this.unit * (this.margin + x - 1),
      this.unit * (this.margin + y - 1)
    );
  },
  _coordsToPoint: function(x, y) {
    var px = Math.round(x / this.unit - this.margin + 1);
    var py = Math.round(y / this.unit - this.margin + 1);
    return new GOBAN.Point(px, py);
  },
  _drawLine: function(sx, sy, ex, ey) {
    var start = this._pointToCoords(sx, sy);
    var end = this._pointToCoords(ex, ey);
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();
  },
  // Draw board
  _drawBoard: function() {
    // draw board
    this.ctx.fillStyle = '#EECC66';
    this.ctx.fillRect(0, 0, this.width, this.width);
    // draw lines
    this.ctx.strokeStyle = '#333333';
    for (var i = 1; i <= this.rows ; i++) {
      this._drawLine(1, i, this.rows, i);          
      this._drawLine(i, 1, i, this.rows);
    }
    // draw stars
    var stars = this.stars[this.rows] || [];
    for (var i = 0; i < stars.length; i++) {
      var star = stars[i];
      this._drawStar(star);
    }
  },
  _drawStar: function(p) {
    var point = this._pointToCoords(p.x, p.y);
    this.ctx.fillStyle = "#333333";
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, this.unit * 0.1, 0, Math.PI * 2, true);
    this.ctx.fill();
    this.ctx.stroke();
  }
}

/**
 @namespace GOBAN
 @class Board
 */
GOBAN.Board = function() {
  this.initialize.apply(this, arguments);
}
GOBAN.Board.prototype = {
  initialize: function() {
    // properties
    this.rows = 19;
    this.board = this._buildBoard();
    this.marker = this._buildBoard();
    this.ko = undefined;
    this.color = BLACK;
    // prisoners
    // BLACK => black player's prisoners, white stones.
    this.prisoners = {}
    this.prisoners[BLACK] = 0;
    this.prisoners[WHITE] = 0;
  },
  put: function(p) {
    // check if on board
    if (!this._isOnBoard(p)) {
      alert("Are you drunk? Put it on the board!");
      return;
    }
    // check if empty
    if (this.board[p.x][p.y] != EMPTY) return;
    // check if it was Ko
    if (p.equals(this.ko)) return;
    
    // try putting
    var takens = this._tryPutting(p);
    if (takens.length === 0) {
      // When no taking stone, check if the stone can be put.
      this._resetBoard(this.marker);
      if (this._isEmbraced(p.x, p.y, this.color, [])) {
        this.board[p.x][p.y] = EMPTY;
        return;
      }
      this.ko = undefined;  // make sure to release ko only when succeeded putting stone
    } else {
      // Check if it's Ko
      this.ko = this._getKoStone(p, takens);
      // pick stones
      for (var i = 0; i < takens.length; i++) {
        var taken = takens[i];
        this.board[taken.x][taken.y] = EMPTY;
        this.prisoners[this.color] ++;
      }
    }
    // change the turn
    this.color = this._theOther(this.color);
    
    // TODO: should this be an Object?
    return {move: p, prisoners: takens};
  },
  back: function(move, prisoners) {
    this.board[move.x][move.y] = EMPTY;
    for (var i = 0; i < prisoners.length; i++) {
      var p = prisoners[i];
      this.board[p.x][p.y] = this.color;
    }
    this.prisoners[this._theOther(this.color)] -= prisoners.length;
    this.color = this._theOther(this.color);
    // Judge if it's Ko
    this.ko = this._getKoStone(p, prisoners);
  },
  //
  // private methods
  //
  _at: function(p) {
    return this.board[p.x][p.y];
  },
  // try putting stone and check if some stones can be taken
  _tryPutting :function(p) {
    this.board[p.x][p.y] = this.color;
    this._resetBoard(this.marker);
    var takens = [];
    // check each neighbor
    var neighbors = this._getNeighbors(p.x, p.y);
    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];
      if (this.marker[p.x][p.y] != CHECKED) {
        var stones = [];
        if (this._isEmbraced(neighbor.x, neighbor.y, this._theOther(this.color), stones)) {
          takens = takens.concat(stones);
        };
      }
    }
    return takens;
  },
  // check connected stones and whether they are surrounded by
  // stones of the other color
  _isEmbraced: function(x, y, color, stones) {
    if (this.marker[x][y] === CHECKED) return true;
    if (this.board[x][y] === color) {
      this.marker[x][y] = CHECKED;
      // TODO: select marker or stones
      stones.push(new GOBAN.Point(x, y));
      // check neighbors
      var result = true;
      var neighbors = this._getNeighbors(x, y);
      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];
        result = this._isEmbraced(neighbor.x, neighbor.y, color, stones) && result;  // check even if result === false
      }
      return result;
    } else if (this.board[x][y] === EMPTY) {
      return false;
    } else {
      return true;
    }
  },
  // Utility
  _theOther: function(color) {
    switch (color) {
    case BLACK:
      return WHITE;
    case WHITE:
      return BLACK;
    default:
      throw {name: "IllegalColor", message: "No such color as " + color + "!"};
    }
  },
  _isOnBoard: function(p) {
    return p.x >= 1 && p.x <= this.rows && p.y >= 1 && p.y <= this.rows;
  },
  _buildBoard: function() {
    var board = [];
    for (var i = 0; i < this.rows + 2; i++) {
      var column = [];
      if (i === 0 || i === this.rows + 1) {
        for (var j = 0; j < this.rows + 2; j++) {
          column[j] = BORDER;
        }
      } else {
        column[0] = column[this.rows + 1] = -1;
        for (var j = 1; j < this.rows + 1; j++) {
          column[j] = EMPTY;
        }
      }
      board[i] = column;
    }
    return board;
  },
  _resetBoard: function(board) {
    for (var i = 1; i < this.rows + 1; i++) {
      for (var j = 1; j < this.rows + 1; j++) {
        board[i][j] = EMPTY;
      }
    }
  },
  _getNeighbors: function(x, y) {
    var neighbors = [];
    if (x > 1) neighbors.push(new GOBAN.Point(x - 1, y));
    if (x < this.rows) neighbors.push(new GOBAN.Point(x + 1, y));
    if (y > 1) neighbors.push(new GOBAN.Point(x, y - 1));
    if (y < this.rows) neighbors.push(new GOBAN.Point(x, y + 1));
    return neighbors;
  },
  // check if it is Ko
  // !!! make sure to use before taking prisoners from the board !!!
  _getKoStone: function(move, prisoners) {
    if (prisoners.length === 1) {
      var neighbors = this._getNeighbors(move.x, move.y);
      var surrounded = true;
      for (var i = 0; i < neighbors.length; i++) {
        var status = this._at(neighbors[i]);
        surrounded = surrounded && (status === this._theOther(this.color) || status === BORDER);
      }
      return surrounded ? prisoners[0] : undefined;
    } else {
      return undefined;
    }
  },
}
/**
 @namespace GOBAN
 @class Controller
 */
GOBAN.Controller = function() {
  this.initialize.apply(this, arguments);
}
GOBAN.Controller.prototype = {
  initialize: function(view, board) {
    this.view = view;
    this.board = board;
    this.history = [];
    this.current = -1;
    this.view.onClick = GOBAN.Utils.bind(this, this.onViewClick);
  },
  onViewClick: function(p) {
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
  },
  onPrevious: function()
  {
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
  },
  onNext: function()
  {
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
  },
  onBeginning: function() {
    while (this.current >= 0) {
      this.onPrevious();
    }
  },
  onLast: function() {
    while (this.current <= this.history.length - 2) {
      this.onNext();
    }
  },
  //
  // private methods
  //
  _updateControl: function() {
    GOBAN.Utils.$("current").innerHTML = this.current + 1;
    GOBAN.Utils.$("black_prisoner").innerHTML = this.board.prisoners[BLACK];
    GOBAN.Utils.$("white_prisoner").innerHTML = this.board.prisoners[WHITE];
  },
  _putAndRemove: function(stone, prisoners) {
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


