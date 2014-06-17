import { EMPTY, BLACK, WHITE, BORDER, CHECKED } from './constants';
import Point from './point';

export default class Board {
  constructor() {
    // properties
    this.rows = 19;
    this.board = this._buildBoard();
    this.marker = this._buildBoard();
    this.ko = undefined;
    this.color = BLACK;
    // prisoners
    // BLACK => black player's prisoners, white stones.
    this.prisoners = {};
    this.prisoners[BLACK] = 0;
    this.prisoners[WHITE] = 0;
  }

  put(p) {
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
  }

  back(move, prisoners) {
    this.board[move.x][move.y] = EMPTY;
    for (var i = 0; i < prisoners.length; i++) {
      var p = prisoners[i];
      this.board[p.x][p.y] = this.color;
    }
    this.prisoners[this._theOther(this.color)] -= prisoners.length;
    this.color = this._theOther(this.color);
    // Judge if it's Ko
    this.ko = this._getKoStone(p, prisoners);
  }

  //
  // private methods
  //
  _at(p) {
    return this.board[p.x][p.y];
  }

  // try putting stone and check if some stones can be taken
  _tryPutting(p) {
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
        }
      }
    }
    return takens;
  }

  // check connected stones and whether they are surrounded by
  // stones of the other color
  _isEmbraced(x, y, color, stones) {
    if (this.marker[x][y] === CHECKED) return true;
    if (this.board[x][y] === color) {
      this.marker[x][y] = CHECKED;
      // TODO: select marker or stones
      stones.push(new Point(x, y));
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
  }

  // Utility
  _theOther(color) {
    switch (color) {
    case BLACK:
      return WHITE;
    case WHITE:
      return BLACK;
    default:
      throw {name: "IllegalColor", message: "No such color as " + color + "!"};
    }
  }

  _isOnBoard(p) {
    return p.x >= 1 && p.x <= this.rows && p.y >= 1 && p.y <= this.rows;
  }

  _buildBoard() {
    var board = [];
    var i, j;
    var column;
    for (i = 0; i < this.rows + 2; i++) {
      column = [];
      if (i === 0 || i === this.rows + 1) {
        for (j = 0; j < this.rows + 2; j++) {
          column[j] = BORDER;
        }
      } else {
        column[0] = column[this.rows + 1] = -1;
        for (j = 1; j < this.rows + 1; j++) {
          column[j] = EMPTY;
        }
      }
      board[i] = column;
    }
    return board;
  }

  _resetBoard(board) {
    var i, j;
    for (i = 1; i < this.rows + 1; i++) {
      for (j = 1; j < this.rows + 1; j++) {
        board[i][j] = EMPTY;
      }
    }
  }

  _getNeighbors(x, y) {
    var neighbors = [];
    if (x > 1) neighbors.push(new Point(x - 1, y));
    if (x < this.rows) neighbors.push(new Point(x + 1, y));
    if (y > 1) neighbors.push(new Point(x, y - 1));
    if (y < this.rows) neighbors.push(new Point(x, y + 1));
    return neighbors;
  }

  // check if it is Ko
  // !!! make sure to use before taking prisoners from the board !!!
  _getKoStone(move, prisoners) {
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
  }
}
