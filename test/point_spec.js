import Point from '../src/point';

describe('Point', function () {
  var point;

  beforeEach(function () {
    point = new Point(3, 4);
  });

  describe('new', function () {
    it('holds passed coordinates', function () {
      expect(point.x).to.eq(3);
      expect(point.y).to.eq(4);
    });
  });

  describe('#equals', function () {
    it('equals another point with the same coordinates', function () {
      expect(point.equals(new Point(3, 4))).to.be.true;
      expect(point.equals(new Point(5, 4))).to.be.false;
    });

    it('equals an object with the same x and y', function () {
      expect(point.equals({ x: 3, y: 4})).to.be.true;
      expect(point.equals({ x: 5, y: 4})).to.be.false;
    });
  });
});

