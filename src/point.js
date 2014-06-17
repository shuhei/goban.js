// Public: Point on the board.
export default class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // Public: Check equality with another point.
  //
  // p - Another Point.
  //
  // Returns Boolean whether the given Point is the same as this Point.
  equals(p) {
    return typeof p === "object" && this.x === p.x && this.y === p.y;
  }
}
