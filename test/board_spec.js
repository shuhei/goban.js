import Point from '../src/point';
import Board from '../src/board';

describe('Board', function () {
  var board;

  beforeEach(function () {
    board = new Board();
  });

  describe('#put', function () {
    it('returns put position', function () {
      var point = new Point(3, 3);
      var res = board.put(point);
      expect(res.move).to.eq(point);
    });

    it('returns prisoners taken by the move', function () {
      //   123456
      // 1 ------
      // 2 ------
      // 3 --14--
      // 5 -7236-
      // 5 --5---
      // 6 ------
      var taken = new Point(3, 4);
      board.put(new Point(3, 3)); // B
      board.put(taken); // W
      board.put(new Point(4, 4)); // B
      board.put(new Point(4, 3)); // W
      board.put(new Point(3, 5)); // B
      board.put(new Point(5, 4)); // W
      var res = board.put(new Point(2, 4)); // B
      var prisoners = res.prisoners;
      expect(prisoners.length).to.eq(1);
      expect(prisoners[0].equals(taken)).to.be.true;
    });
  });
});
