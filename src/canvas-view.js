import Point from './point';
import { bind } from './utils';

export default class CanvasView {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    
    this.rows = 19;
    this.unit = 21;
    this.margin = 0.7;
    this.width = this.unit * (this.rows - 1 + this.margin * 2);
    
    this.stars = { 19: [
      new Point( 4, 4), new Point( 4, 10), new Point( 4, 16),
      new Point(10, 4), new Point(10, 10), new Point(10, 16),
      new Point(16, 4), new Point(16, 10), new Point(16, 16)
    ]};
    
    this._drawBoard();
    
    this.canvas.addEventListener('click', bind(this, this._onCanvasClick), false);
  }

  // Draw stones
  drawBlack(x, y) {
    this._drawStone(x, y, '#000000');
  }

  drawWhite(x, y) {
    this._drawStone(x, y, '#FFFFFF');
  }

  removeStone(x, y) {
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
    stars.forEach((star, i) => {
      if (star.x === x && star.y === y) {
        this._drawStar(star);
      }
    });
  }

  // Utility functions
  _onCanvasClick(e) {
    //alert(this.width);
    var x = e.pageX - this.canvas.offsetLeft;
    var y = e.pageY - this.canvas.offsetTop;
    var p = this._coordsToPoint(x, y);
    if (this.onClick) {
      this.onClick(p);
    }
  }

  _drawStone(x, y, color) {
    var p = this._pointToCoords(x, y);
    this.ctx.fillStyle = color;
    //this.ctx.strokeStyle = '#333333';
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, this.unit * 0.5 - 1.0, 0, Math.PI * 2, true);
    this.ctx.fill();
    this.ctx.stroke();
  }

  _pointToCoords(x, y) {
    return new Point(
      this.unit * (this.margin + x - 1),
      this.unit * (this.margin + y - 1)
    );
  }

  _coordsToPoint(x, y) {
    var px = Math.round(x / this.unit - this.margin + 1);
    var py = Math.round(y / this.unit - this.margin + 1);
    return new Point(px, py);
  }

  _drawLine(sx, sy, ex, ey) {
    var start = this._pointToCoords(sx, sy);
    var end = this._pointToCoords(ex, ey);
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();
  }

  // Draw board
  _drawBoard() {
    // draw board
    this.ctx.fillStyle = '#EECC66';
    this.ctx.fillRect(0, 0, this.width, this.width);

    // draw lines
    this.ctx.strokeStyle = '#333333';
    for (var i = 1; i <= this.rows; i++) {
      this._drawLine(1, i, this.rows, i);
      this._drawLine(i, 1, i, this.rows);
    }

    // draw stars
    var stars = this.stars[this.rows] || [];
    stars.forEach((star) => { this._drawStar(star); });
  }

  _drawStar(p) {
    var point = this._pointToCoords(p.x, p.y);
    this.ctx.fillStyle = '#333333';
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, this.unit * 0.1, 0, Math.PI * 2, true);
    this.ctx.fill();
    this.ctx.stroke();
  }
}
